import { useState, useEffect, useRef, lazy, Suspense } from "react";
import React from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  CreditCard, Wallet, Banknote, MapPin, Navigation,
  Loader2, ShoppingBag, ArrowLeft, CheckCircle2, ChevronRight,
  AlertTriangle, Truck
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";

// ── Razorpay Type Definition ──────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: any;
  }
}

// ── Reverse geocode (Geoapify) ────────────────────────────────────────────────
async function reverseGeocode(lat: number, lng: number, setAddress: (a: string) => void) {
  try {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=622381795a5c45e7980ea9cf54170eee`
    );
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      setAddress(data.features[0].properties.formatted);
    } else {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
  } catch {
    setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
  }
}

// ── Lazy-load the entire map widget (prevents Leaflet from crashing the page) ──
const CheckoutMap = lazy(() => import("@/components/CheckoutMap"));

// ── Error boundary for the map ────────────────────────────────────────────────
class MapErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean, errorMsg: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, errorMsg: error?.message || String(error) }; }
  componentDidCatch(err: any) { console.warn("Map error:", err); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[280px] flex-col items-center justify-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] text-center px-6">
          <AlertTriangle className="h-7 w-7 text-[#c9a84c]" />
          <p className="text-sm text-gray-400">Map couldn't load.</p>
          <p className="text-xs text-red-500 font-mono break-all">{this.state.errorMsg}</p>
          <p className="text-xs text-gray-600">
            Enter your address manually in the field above — your order will still go through.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const COIMBATORE: [number, number] = [11.0168, 76.9558];
const PAYMENT_OPTIONS = [
  { value: "cod",  label: "Cash on Delivery",  icon: Banknote,   desc: "Pay when your order arrives" },
  { value: "upi",  label: "UPI (Online)",      icon: Wallet,     desc: "GPay · PhonePe · Paytm" },
  { value: "card", label: "Card (Online)",     icon: CreditCard,  desc: "Credit / Debit card" },
];

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [coords, setCoords]   = useState<[number, number]>(COIMBATORE);
  const [detecting, setDetecting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);

  const deliveryFee = total >= 299 ? 0 : 40;
  const grandTotal  = total + deliveryFee;

  // ── Load user ────────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    const u = JSON.parse(stored);
    setUser(u);
    if (u.address) setAddress(u.address);
  }, [navigate]);

  // ── GPS detect ───────────────────────────────────────────────────────────
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords([lat, lng]);
        await reverseGeocode(lat, lng, setAddress);
        setDetecting(false);
        toast.success("📍 Location detected!");
      },
      () => {
        toast.error("GPS blocked by browser. Please enter your address manually.", {
            style: { border: "1px solid #e23744" }
        });
        setDetecting(false);
      },
      { timeout: 10000 }
    );
  };

  // ── Razorpay Payment Flow ────────────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY;

    if (!keyId || keyId.includes("YOUR_KEY")) {
      toast.error("Razorpay Key ID missing! Please add it to your .env file.");
      return;
    }

    const options = {
      key: keyId,
      amount: grandTotal * 100, // Amount in paise
      currency: "INR",
      name: "FoodExpress",
      description: `Order for ${items.length} items`,
      image: "https://your-logo-url.com", // Add your logo here
      handler: async function (response: any) {
        // Success callback
        toast.success("💳 Payment Successful!");
        await finalizeOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: user?.name || user?.username,
        email: user?.email,
        contact: user?.phone || "9999999999",
      },
      theme: {
        color: "#c9a84c",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ── Finalize Order (After payment or if COD) ──────────────────────────────
  const finalizeOrder = async (paymentId: string | null = null) => {
    setPlacing(true);
    try {
      const res = await api.post("/orders/place", {
        userId:       user.id,
        restaurantId: items[0]?.restaurantId,
        items:        items.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price })),
        total:        grandTotal,
        paymentMethod,
        paymentId:    paymentId, // Razorpay ID if online
        address,
        latitude:     coords[0],
        longitude:    coords[1],
      });

      if (res.success) {
        toast.success("🎉 Order placed successfully!");
        clearCart();
        navigate(`/track-order?orderId=${res.orderId}`);
      } else {
        toast.error(res.message || "Failed to place order");
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errMsg);
    } finally {
      setPlacing(false);
    }
  };

  // ── Initiate Checkout ────────────────────────────────────────────────────
  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.error("Please enter or detect your delivery address");
      return;
    }

    if (paymentMethod === "cod") {
      await finalizeOrder();
    } else {
      await handleRazorpayPayment();
    }
  };

  // ── Empty cart guard ─────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center gap-5">
        <ShoppingBag className="h-16 w-16 text-gray-700" />
        <h2 className="text-2xl font-black text-white">Your cart is empty</h2>
        <Link to="/">
          <Button className="bg-[#c9a84c] hover:bg-[#b8943d] text-black font-bold rounded-full px-8">
            Browse Restaurants
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-20">
      <Header />

      <div className="container py-8">
        {/* Title */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2a2a2a] text-gray-400 hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-black text-2xl text-white">Checkout</h1>
            <p className="text-xs text-gray-500">
              {items.length} item{items.length !== 1 ? "s" : ""} · ₹{grandTotal}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* ───── LEFT: Address + Map + Payment ───── */}
          <div className="lg:col-span-3 space-y-5">
            {/* Delivery Address Card */}
            <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#00ADB5]" />
                  <span className="font-bold text-white text-sm">Delivery Address</span>
                </div>
                <button
                  onClick={detectLocation}
                  disabled={detecting}
                  className="flex items-center gap-1.5 rounded-full border border-[#00ADB5]/30 bg-[#00ADB5]/10 px-3 py-1.5 text-xs font-bold text-[#00ADB5] hover:bg-[#00ADB5]/20 transition-all disabled:opacity-60"
                >
                  {detecting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Navigation className="h-3 w-3" />
                  )}
                  {detecting ? "Detecting…" : "Use My Location"}
                </button>
              </div>

              <div className="px-5 pt-4 pb-3">
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Type your full delivery address, or click 'Use My Location' or drag the pin on the map below…"
                  className="w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-[#00ADB5]/50 focus:outline-none transition-colors leading-relaxed"
                />
              </div>

              {/* ── Map (lazy + error-boundary protected) ── */}
              <div className="px-5 pb-5">
                <p className="text-[10px] text-gray-600 mb-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#00ADB5]" />
                  Drag the pin or click on the map to set your exact delivery location
                </p>
                <div className="overflow-hidden rounded-xl border border-[#2a2a2a]" style={{ height: 280 }}>
                  <MapErrorBoundary>
                    <Suspense
                      fallback={
                        <div className="flex h-full items-center justify-center bg-[#0d0d0d]">
                          <Loader2 className="h-6 w-6 animate-spin text-[#00ADB5]" />
                        </div>
                      }
                    >
                      <CheckoutMap
                        coords={coords}
                        setCoords={setCoords}
                        setAddress={setAddress}
                      />
                    </Suspense>
                  </MapErrorBoundary>
                </div>
                <p className="mt-2 text-[10px] text-gray-600">
                  📍 Pin at: {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="h-4 w-4 text-[#c9a84c]" />
                <span className="font-bold text-white text-sm">Payment Method</span>
              </div>
              <div className="space-y-3">
                {PAYMENT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = paymentMethod === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setPaymentMethod(opt.value)}
                      className={`w-full flex items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all ${
                        active
                          ? "border-[#c9a84c]/50 bg-[#c9a84c]/10"
                          : "border-[#2a2a2a] bg-[#0d0d0d] hover:border-[#2a2a2a]/80"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-[#c9a84c]/20" : "bg-[#1a1a1a]"}`}>
                        <Icon className={`h-5 w-5 ${active ? "text-[#c9a84c]" : "text-gray-500"}`} />
                      </div>
                      <div className="flex-1">
                        <div className={`font-bold text-sm ${active ? "text-[#c9a84c]" : "text-white"}`}>{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </div>
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? "border-[#c9a84c] bg-[#c9a84c]/20" : "border-[#333]"}`}>
                        {active && <div className="h-2.5 w-2.5 rounded-full bg-[#c9a84c]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ───── RIGHT: Order Summary ───── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-[#2a2a2a] bg-[#111111] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1e1e1e]">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-[#c9a84c]" /> Order Summary
                </span>
              </div>

              <div className="px-5 py-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c9a84c]/20 text-[10px] font-black text-[#c9a84c]">
                        {item.quantity}
                      </span>
                      <span className="text-sm text-gray-300 truncate max-w-[140px]">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white">₹{item.price * item.quantity}</span>
                  </div>
                ))}

                <div className="h-px bg-[#1e1e1e] my-2" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Item Total</span>
                    <span className="text-white">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-green-400 font-bold" : "text-white"}>
                      {deliveryFee === 0 ? "FREE 🎉" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-[10px] text-[#00ADB5]">
                      Add ₹{(299 - total).toFixed(0)} more to get FREE delivery!
                    </p>
                  )}
                </div>

                <div className="h-px bg-[#1e1e1e]" />

                <div className="flex items-center justify-between">
                  <span className="font-black text-white">Grand Total</span>
                  <span className="font-black text-xl text-[#c9a84c]">₹{grandTotal}</span>
                </div>

                <Button
                  className="w-full h-12 mt-2 bg-[#c9a84c] hover:bg-[#b8943d] text-black font-black text-base rounded-xl gap-2 disabled:opacity-60"
                  onClick={handleCheckout}
                  disabled={placing || !address.trim()}
                >
                  {placing ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Placing Order…</>
                  ) : (
                    <><CheckCircle2 className="h-4 w-4" /> {paymentMethod === "cod" ? "Place COD Order" : `Pay ₹${grandTotal}`}<ChevronRight className="h-4 w-4" /></>
                  )}
                </Button>

                <p className="text-center text-[10px] text-gray-600">
                  🔒 Secure checkout · Orders cancel in 30 seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
