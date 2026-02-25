import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Bike, MapPin, CheckCircle2, Navigation, 
  Package, Clock, Wallet, TrendingUp,
  LogOut, Shield, ChevronRight, Loader2,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { api } from "@/lib/api";
import { toast } from "sonner";
import MapView from "@/components/MapView";

const DeliveryDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [activeOrder, setActiveOrder] = useState<any>(null);
    const [driverLoc, setDriverLoc] = useState<{ lat: number; lng: number } | null>(null);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [statusUpdating, setStatusUpdating] = useState(false);

    useEffect(() => {
        fetchOrders();
        const timer = setInterval(fetchOrders, 10000); // refresh every 10s
        return () => clearInterval(timer);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/delivery/available_orders");
            if (res.success) {
                setOrders(res.orders);
            }
        } catch (e) {
            console.error("Failed to fetch orders", e);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const startTracking = (order: any) => {
        setActiveOrder(order);
        toast.success("Assignment accepted! Live GPS tracking started.");
        
        // Auto-update status to 'on_the_way' if it wasn't already
        if (order.status !== "on_the_way") {
            updateOrderStatus(order.id, "on_the_way");
        }

        if (navigator.geolocation) {
            const id = navigator.geolocation.watchPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setDriverLoc({ lat, lng });

                    // Send to backend API
                    try {
                        await api.post("/delivery/location/update", {
                            orderId: order.id,
                            latitude: lat,
                            longitude: lng,
                        });
                    } catch (e) {
                        console.error("Failed to update location", e);
                    }
                },
                (error) => {
                    toast.error("Could not get your location. Please check browser permissions.");
                    console.error(error);
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
            setWatchId(id);
        } else {
            toast.error("Geolocation is not supported by your browser");
        }
    };

    const stopTracking = () => {
        if (watchId !== null && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setActiveOrder(null);
        setDriverLoc(null);
    };

    const updateOrderStatus = async (orderId: number, status: string) => {
        setStatusUpdating(true);
        try {
            const res = await api.post("/delivery/update_status", { orderId, status });
            if (res.success) {
                toast.success(`Order status updated to ${status.replace("_", " ")}!`);
                if (activeOrder) {
                    setActiveOrder({ ...activeOrder, status });
                }
                if (status === "delivered") {
                    stopTracking();
                    fetchOrders();
                }
            } else {
                toast.error("Failed to update status");
            }
        } catch (e) {
            toast.error("Error updating status");
        } finally {
            setStatusUpdating(false);
        }
    };

    if (loading && !orders.length) return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#c9a84c]" />
      </div>
    );

    return (
        <div className="min-h-screen bg-[#0d0d0d] pb-20 text-white font-sans">
            <Header />
            
            <div className="container py-8">
              {/* Header */}
              <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Bike className="h-6 w-6 text-[#c9a84c]" />
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Delivery Fleet</h1>
                      </div>
                      <p className="text-gray-500 font-medium tracking-tight">Status: <span className="text-green-500 font-black tracking-widest text-[10px]">● ONLINE & READY</span></p>
                  </div>
                  <div className="flex gap-2">
                      <Button onClick={handleLogout} variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl h-11 px-6 font-bold flex gap-2">
                          <LogOut className="h-4 w-4" /> Go Offline
                      </Button>
                  </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { label: "Today Earnings", value: "₹1,420", icon: Wallet, color: "text-green-500", bg: "bg-green-500/10" },
                  { label: "Trips Done", value: "12", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { label: "On-Duty Time", value: "6.5h", icon: Clock, color: "text-[#c9a84c]", bg: "bg-[#c9a84c]/10" },
                  { label: "Efficiency", value: "98%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
                ].map((s, i) => (
                    <Card key={i} className="bg-[#111111] border-[#2a2a2a] rounded-2xl overflow-hidden group hover:border-[#c9a84c]/20 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{s.label}</p>
                            <p className="text-2xl font-black text-white">{s.value}</p>
                          </div>
                          <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <s.icon className={`h-5 w-5 ${s.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                  {/* Main Job Section */}
                  <div className="lg:col-span-2 space-y-6">
                      {!activeOrder ? (
                          <>
                              <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter">
                                <Navigation className="h-6 w-6 text-[#c9a84c] animate-pulse" /> 
                                LISTED ASSIGNMENTS ({orders.length})
                              </h2>
                              
                              {orders.length === 0 ? (
                                  <div className="p-10 border border-[#2a2a2a] rounded-3xl text-center text-gray-500 bg-[#111] animate-pulse">
                                      No orders pending at the moment.
                                  </div>
                              ) : (
                                  orders.map((order) => (
                                      <Card key={order.id} className="bg-[#111111] border-2 border-dashed border-[#c9a84c]/30 rounded-3xl overflow-hidden mb-6">
                                        <CardHeader className="p-6 border-b border-[#1e1e1e] bg-[#c9a84c]/5">
                                          <div className="flex justify-between items-center mb-4">
                                            <Badge className="bg-[#c9a84c] text-black font-black text-[10px] px-3 rounded-lg">ORDER #{order.id}</Badge>
                                            <span className="text-[11px] font-black text-white uppercase tracking-widest">{order.status}</span>
                                          </div>
                                          <CardTitle className="text-2xl font-black tracking-tighter">{order.restaurant_name} → Delivery</CardTitle>
                                          <CardDescription className="text-gray-400 font-medium">Placed at: {new Date(order.created_at).toLocaleString()}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="flex flex-col gap-6 mb-8 relative">
                                               {/* Timeline dots */}
                                               <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#c9a84c] to-blue-500"></div>
                                               
                                               <div className="flex gap-4 relative">
                                                  <div className="h-4 w-4 rounded-full bg-[#c9a84c] shadow-[0_0_10px_#c9a84c] z-10 shrink-0 mt-1"></div>
                                                  <div>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">PICKUP STORE</p>
                                                    <p className="text-lg font-bold text-white leading-tight">{order.restaurant_name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{order.restaurant_address}</p>
                                                  </div>
                                               </div>

                                               <div className="flex gap-4 relative">
                                                  <div className="h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] z-10 shrink-0 mt-1"></div>
                                                  <div>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">DELIVERY POINT</p>
                                                    <p className="text-lg font-bold text-white leading-tight">{order.delivery_address || `Lat: ${order.user_lat}, Lng: ${order.user_lng}`}</p>
                                                  </div>
                                               </div>
                                            </div>

                                            <div className="flex gap-3">
                                              <Button 
                                                  className="flex-1 bg-[#c9a84c] text-black hover:bg-[#b8943d] rounded-2xl h-14 font-black shadow-xl shadow-[#c9a84c]/10"
                                                  onClick={() => startTracking(order)}
                                              >
                                                ACCEPT & START GPS
                                              </Button>
                                            </div>
                                        </CardContent>
                                      </Card>
                                  ))
                              )}
                          </>
                      ) : (
                          <>
                              <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter text-green-500">
                                  <Navigation className="h-6 w-6 animate-pulse" />
                                  ACTIVE TRIP #{activeOrder.id}
                              </h2>

                              <Card className="bg-[#111111] border-2 border-[#2a2a2a] rounded-3xl overflow-hidden mb-6">
                                  <CardHeader className="p-4 border-b border-[#1e1e1e] bg-[#0d0d0d]">
                                      <CardTitle className="text-lg font-bold flex justify-between items-center">
                                          <span>Live Area Tracking</span>
                                          {driverLoc ? (
                                             <Badge className="bg-green-500 text-white animate-pulse">GPS ACTIVE</Badge>
                                          ) : (
                                             <Badge className="bg-orange-500 text-white animate-pulse">LOCATING YOU...</Badge>
                                          )}
                                      </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-0 border-b border-[#1e1e1e]">
                                      {/* MAP DISPLAY */}
                                      <div className="w-full h-[400px] bg-[#1a1a1a]">
                                          <MapView 
                                              height="100%"
                                              width="100%"
                                              zoom={14}
                                              center={driverLoc ? [driverLoc.lat, driverLoc.lng] : [activeOrder.restaurant_lat, activeOrder.restaurant_lng]}
                                              trackOrder={{
                                                  restaurant: { lat: activeOrder.restaurant_lat, lng: activeOrder.restaurant_lng, name: activeOrder.restaurant_name },
                                                  user: { lat: activeOrder.user_lat || activeOrder.restaurant_lat + 0.01, lng: activeOrder.user_lng || activeOrder.restaurant_lng + 0.02, name: "Customer" },
                                                  delivery: driverLoc || undefined
                                              }}
                                          />
                                      </div>
                                  </CardContent>
                                  <div className="p-4 bg-[#0d0d0d]">
                                     <div className="flex flex-col sm:flex-row gap-4">
                                          {['pending', 'preparing', 'on_the_way'].includes(activeOrder.status) && (
                                              <Button 
                                                  className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl h-14 font-black shadow-xl shadow-green-500/20"
                                                  onClick={() => updateOrderStatus(activeOrder.id, "delivered")}
                                                  disabled={statusUpdating}
                                              >
                                                 <CheckCircle2 className="h-5 w-5 mr-2" />
                                                 MARK AS DELIVERED
                                              </Button>
                                          )}
                                          <Button 
                                              variant="destructive"
                                              className="rounded-2xl h-14 px-6 font-bold"
                                              onClick={stopTracking}
                                              disabled={statusUpdating}
                                          >
                                             Cancel Trip
                                          </Button>
                                     </div>
                                  </div>
                              </Card>
                          </>
                      )}
                  </div>

                  {/* Sidebar - Performance */}
                  <div className="space-y-6">
                      <h2 className="text-2xl font-black tracking-tighter">PERFORMANCE</h2>
                      <Card className="bg-[#111111] border-[#2a2a2a] rounded-3xl overflow-hidden">
                        <CardContent className="p-6">
                          <div className="space-y-6">
                             <div className="flex items-center justify-between p-4 bg-[#0d0d0d] rounded-2xl border border-[#1e1e1e]">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 font-black italic">4.9</div>
                                  <div className="text-sm font-bold">Fleet Rating</div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-700" />
                             </div>

                             <div className="flex items-center justify-between p-4 bg-[#0d0d0d] rounded-2xl border border-[#1e1e1e]">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-black italic">!</div>
                                  <div className="text-sm font-bold">Pending Payout</div>
                                </div>
                                <span className="text-xs font-black text-white">₹4,280</span>
                             </div>
                             
                             <div className="pt-4">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">LOGISTICS LOG</p>
                                <div className="space-y-4">
                                   {[1,2,3].map(i => (
                                     <div key={i} className="flex gap-3 items-start opacity-60">
                                        <div className="h-2 w-2 rounded-full bg-gray-700 mt-1.5"></div>
                                        <div>
                                          <p className="text-xs font-bold text-gray-300">#TRIP-900{i} Completed</p>
                                          <p className="text-[9px] text-gray-600">2 hours ago</p>
                                        </div>
                                     </div>
                                   ))}
                                </div>
                             </div>

                             <Button variant="outline" className="w-full border-[#2a2a2a] text-[#c9a84c] rounded-xl font-bold h-11 text-xs uppercase tracking-widest hover:bg-[#c9a84c]/5">
                                View Full History
                             </Button>
                          </div>
                        </CardContent>
                      </Card>
                  </div>
              </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
