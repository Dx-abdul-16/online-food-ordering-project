import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, CheckCircle2, ChefHat, Bike, Package, Phone, QrCode, Scan, ShieldCheck, AlertCircle, Truck } from "lucide-react";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// We lazy-import MapView to avoid SSR issues with Leaflet
import MapView from "@/components/MapView";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import QRScanner from "@/components/QRScanner";

// ─── Order status steps ───────────────────────────────────────────────────────
const STATUS_STEPS = [
  { key: "pending",     label: "Order Placed",        icon: Package,      color: "#c9a84c" },
  { key: "confirmed",   label: "Order Confirmed",      icon: CheckCircle2, color: "#c9a84c" },
  { key: "preparing",   label: "Being Prepared",       icon: ChefHat,      color: "#fc8019" },
  { key: "on_the_way",  label: "On The Way",           icon: Bike,         color: "#fc8019" },
  { key: "delivered",   label: "Delivered",            icon: CheckCircle2, color: "#4ade80" },
];

const getStepIndex = (status: string) =>
  STATUS_STEPS.findIndex((s) => s.key === status?.toLowerCase().replace(" ", "_")) ?? 1;

// ─── ETA based on status ─────────────────────────────────────────────────────
const getETA = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s === "delivered") return "Delivered ✓";
  if (s === "on_the_way" || s === "on the way") return "~10 mins";
  if (s === "preparing") return "~25 mins";
  return "~35 mins";
};

// ─── Coimbatore delivery partner mock positions ───────────────────────────────
const MOCK_DELIVERY = { lat: 11.015, lng: 76.960 };
const COIMBATORE_CENTER: [number, number] = [11.0168, 76.9558];

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);
  const [deliveryLoc, setDeliveryLoc] = useState(MOCK_DELIVERY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nearbyPartners, setNearbyPartners] = useState<any[]>([]);
  const [qrData, setQrData] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch order details ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        // Demo mode — show a fake order
        setOrder({
          id: "DEMO",
          status: "on_the_way",
          restaurant_name: "Street Arabiya",
          restaurant_location: "Near Sathy Road Junction, Saravanampatti, Coimbatore, Tamil Nadu",
          restaurant_lat: 11.0168,
          restaurant_lng: 76.9558,
          total_amount: 349,
          delivery_address: "Near KG College, Saravanampatti, Coimbatore, Tamil Nadu",
          items: [
            { item_name: "Chicken Shawarma", quantity: 2, price: 149 },
            { item_name: "Afghani Alfaham", quantity: 1, price: 399 },
          ],
        });
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/orders/${orderId}`);
        if (res.success && res.order) {
          setOrder(res.order);
        } else {
          setError("Order not found. Showing demo mode.");
          setOrder({ id: orderId, status: "preparing", restaurant_name: "FoodExpress", total_amount: 0, items: [] });
        }
      } catch {
        setError("Could not load order. Showing demo view.");
        setOrder({ id: orderId, status: "preparing", restaurant_name: "FoodExpress", total_amount: 0, items: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // ── Fetch QR Data for customer ──────────────────────────────────────────────
  useEffect(() => {
    if (!orderId) return;
    const fetchQr = async () => {
      try {
        const res = await api.get(`/delivery/qr/${orderId}`);
        if (res.success) {
          setQrData(res);
          setConfirmStatus(res.customerConfirmed);
        }
      } catch {}
    };
    fetchQr();
    const timer = setInterval(fetchQr, 10000);
    return () => clearInterval(timer);
  }, [orderId]);

  // ── Fetch nearby delivery partners ──────────────────────────────────────────
  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const res = await api.get(`/delivery/nearby?lat=${COIMBATORE_CENTER[0]}&lng=${COIMBATORE_CENTER[1]}`);
        if (res.success) {
          setNearbyPartners(res.partners);
        }
      } catch {}
    };
    fetchNearby();
    const timer = setInterval(fetchNearby, 15000);
    return () => clearInterval(timer);
  }, []);

  // ── Poll delivery location ─────────────────────────────────────────────────
  useEffect(() => {
    if (!orderId) return;

    const fetchLocation = async () => {
      try {
        const res = await api.get(`/delivery/location/${orderId}`);
        if (res.success) {
          setDeliveryLoc({ lat: parseFloat(res.latitude), lng: parseFloat(res.longitude) });
        }
      } catch {
        // Silently keep last position — API might not have tracking yet
      }
    };

    fetchLocation();
    intervalRef.current = setInterval(fetchLocation, 8000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [orderId]);

  // ── Simulate partner movement in demo mode ─────────────────────────────────
  useEffect(() => {
    if (orderId) return; // Only in demo mode
    const interval = setInterval(() => {
      setDeliveryLoc((prev) => ({
        lat: prev.lat + (COIMBATORE_CENTER[0] > prev.lat ? 0.0005 : -0.0005),
        lng: prev.lng + (COIMBATORE_CENTER[1] > prev.lng ? 0.0005 : -0.0005),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [orderId]);

  // ── Handle customer QR scan confirmation ────────────────────────────────────
  const handleCustomerScan = async (code: string) => {
    setShowScanner(false);
    if (!orderId) {
      toast.info("Demo mode - scan feature requires a real order");
      return;
    }
    
    try {
      const res = await api.post("/delivery/confirm-delivery", {
        orderId: parseInt(orderId),
        qrHash: code,
        confirmed: true
      });
      if (res.success) {
        toast.success("✅ Order confirmed as received!");
        setConfirmStatus("received");
      } else {
        toast.error(res.message || "Verification failed");
      }
    } catch (e: any) {
      toast.error(e.message || "Verification failed");
    }
  };

  const handleNotReceived = async () => {
    if (!orderId || !qrData?.qrHash) return;
    try {
      const res = await api.post("/delivery/confirm-delivery", {
        orderId: parseInt(orderId),
        qrHash: qrData.qrHash,
        confirmed: false
      });
      if (res.success) {
        toast.warning("Order marked as NOT received. Support has been notified.");
        setConfirmStatus("not_received");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to report");
    }
  };

  // ── Derived values ─────────────────────────────────────────────────────────
  const stepIndex = getStepIndex(order?.status);
  const restaurantCenter: [number, number] = order?.restaurant_lat && order?.restaurant_lng
    ? [order.restaurant_lat, order.restaurant_lng]
    : COIMBATORE_CENTER;

  const trackOrder = {
    restaurant: { lat: restaurantCenter[0], lng: restaurantCenter[1], name: order?.restaurant_name },
    user: { lat: COIMBATORE_CENTER[0] + 0.02, lng: COIMBATORE_CENTER[1] + 0.03, name: "Your Location" },
    delivery: deliveryLoc,
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl animate-bounce">🛵</div>
          <div className="h-1 w-40 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-[#c9a84c] to-[#fc8019] rounded-full animate-pulse" />
          </div>
          <p className="text-gray-400 font-medium text-sm">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-20">
      <Header />

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleCustomerScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      <div className="container py-8 space-y-6">
        {/* ── Back + Title ── */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2a2a2a] text-gray-400 hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-black text-xl text-white">
              Live Tracking {order?.id !== "DEMO" ? `#${order?.id}` : "(Demo)"}
            </h1>
            <p className="text-sm text-gray-500">
              {order?.restaurant_name} → {order?.delivery_address || "Your Location"}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-[#fc8019]/30 bg-[#fc8019]/10 px-4 py-3 text-sm text-[#fc8019]">
            ⚠️ {error}
          </div>
        )}

        {/* ── Status Timeline ── */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-5">
          <div className="flex items-start justify-between relative">
            {/* Progress line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#2a2a2a]">
              <div
                className="h-full bg-gradient-to-r from-[#c9a84c] to-[#fc8019] transition-all duration-700"
                style={{ width: `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
            </div>

            {STATUS_STEPS.map((step, i) => {
              const Icon = step.icon;
              const done = i <= stepIndex;
              const active = i === stepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center gap-2 z-10" style={{ flexBasis: `${100 / STATUS_STEPS.length}%` }}>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      done
                        ? "border-[#c9a84c] bg-[#c9a84c]/20"
                        : "border-[#2a2a2a] bg-[#0d0d0d]"
                    } ${active ? "ring-2 ring-[#c9a84c]/30 scale-110" : ""}`}
                  >
                    <Icon className={`h-4 w-4 ${done ? "text-[#c9a84c]" : "text-gray-600"}`} />
                  </div>
                  <span className={`text-[10px] font-semibold text-center leading-tight ${done ? "text-white" : "text-gray-600"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Map ── */}
        <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] relative">
          {/* ETA badge */}
          <div className="absolute top-3 left-3 z-[999] flex items-center gap-2 bg-black/80 backdrop-blur rounded-full px-3 py-1.5 border border-[#c9a84c]/30">
            <Clock className="h-3.5 w-3.5 text-[#c9a84c]" />
            <span className="text-xs font-bold text-[#c9a84c]">{getETA(order?.status)}</span>
          </div>
          {/* Nearby partners badge */}
          {nearbyPartners.length > 0 && (
            <div className="absolute top-3 right-3 z-[999] flex items-center gap-2 bg-black/80 backdrop-blur rounded-full px-3 py-1.5 border border-green-500/30">
              <Truck className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs font-bold text-green-500">{nearbyPartners.length} partners nearby</span>
            </div>
          )}
          <MapView
            trackOrder={trackOrder}
            zoom={14}
            height="380px"
          />
        </div>

        {/* ── QR Delivery Confirmation (Customer) ── */}
        {qrData && order?.status === "on_the_way" && (
          <div className="rounded-3xl border-2 border-dashed border-[#c9a84c]/30 bg-[#111111] p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-black text-white flex items-center justify-center gap-2">
                <QrCode className="h-5 w-5 text-[#c9a84c]" />
                Delivery QR Code
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Show this to your delivery partner, or scan their QR to confirm
              </p>
            </div>

            {confirmStatus === "received" ? (
              <div className="text-center p-6">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-3" />
                <p className="text-green-500 font-black text-lg">ORDER CONFIRMED ✅</p>
                <p className="text-gray-500 text-xs mt-1">You confirmed receiving this order</p>
              </div>
            ) : confirmStatus === "not_received" ? (
              <div className="text-center p-6">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-3" />
                <p className="text-red-500 font-black text-lg">MARKED NOT RECEIVED</p>
                <p className="text-gray-500 text-xs mt-1">Support has been notified</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <QRCodeDisplay value={qrData.qrHash} size={160} label="Your Order QR" />
                <div className="space-y-3 text-center sm:text-left">
                  <p className="text-sm text-gray-400">
                    When your delivery arrives, confirm:
                  </p>
                  <Button
                    onClick={() => setShowScanner(true)}
                    className="bg-[#c9a84c] text-black hover:bg-[#b8943d] rounded-2xl h-12 px-6 font-black w-full flex gap-2"
                  >
                    <Scan className="h-4 w-4" /> SCAN & CONFIRM RECEIVED
                  </Button>
                  <Button
                    onClick={handleNotReceived}
                    variant="outline"
                    className="border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-2xl h-12 px-6 font-bold w-full flex gap-2"
                  >
                    <AlertCircle className="h-4 w-4" /> NOT RECEIVED
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Nearby Delivery Partners ── */}
        {nearbyPartners.length > 0 && (
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-5">
            <h3 className="font-black text-white mb-4 flex items-center gap-2">
              <Truck className="h-4 w-4 text-green-500" /> Nearby Delivery Partners ({nearbyPartners.length})
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {nearbyPartners.slice(0, 6).map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e]">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Bike className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{p.name || `Partner #${p.id}`}</p>
                    <p className="text-[9px] text-gray-500">
                      {p.live_latitude?.toFixed(3)}, {p.live_longitude?.toFixed(3)}
                    </p>
                  </div>
                  <Badge className="ml-auto bg-green-500/10 text-green-500 text-[8px] px-1.5 py-0.5">ONLINE</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Info cards ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* ETA */}
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-[#c9a84c]" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">ETA</span>
            </div>
            <div className="text-2xl font-black text-white">{getETA(order?.status)}</div>
            <div className="text-xs text-gray-500 mt-1 capitalize">{order?.status?.replace("_", " ") || "Processing"}</div>
          </div>

          {/* Delivery partner */}
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bike className="h-4 w-4 text-[#fc8019]" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Delivery Partner</span>
            </div>
            <div className="text-base font-bold text-white">Delivery Fleet</div>
            <div className="text-xs text-gray-500 mt-1">FoodExpress Verified</div>
            <a
              href="tel:+919629075139"
              className="mt-3 flex items-center gap-1.5 text-xs text-[#c9a84c] hover:underline"
            >
              <Phone className="h-3 w-3" /> Call Partner
            </a>
          </div>

          {/* Order total */}
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-[#e23744]" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Restaurant</span>
            </div>
            <div className="text-base font-bold text-white">{order?.restaurant_name || "—"}</div>
            <div className="text-xs text-gray-500 mt-1">{order?.restaurant_location || "Saravanampatti, Coimbatore, Tamil Nadu"}</div>
            <div className="mt-2 text-xs font-bold text-[#c9a84c]">Total: ₹{order?.total_amount}</div>
          </div>
        </div>

        {/* ── Order Items ── */}
        {order?.items && order.items.length > 0 && (
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-[#c9a84c]" /> Your Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c9a84c]/20 text-xs font-bold text-[#c9a84c]">
                      {item.quantity}
                    </span>
                    <span className="text-sm font-medium text-white">{item.item_name || "Menu Item"}</span>
                  </div>
                  <span className="text-sm font-bold text-[#c9a84c]">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="h-px bg-[#2a2a2a] my-3" />
              <div className="flex justify-between font-black text-white">
                <span>Total</span>
                <span className="text-[#c9a84c]">₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Help link ── */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Having issues?{" "}
            <a href="tel:+919629075139" className="text-[#c9a84c] hover:underline font-semibold">
              Call Support
            </a>
            {" · "}
            <Link to="/" className="text-[#c9a84c] hover:underline font-semibold">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
