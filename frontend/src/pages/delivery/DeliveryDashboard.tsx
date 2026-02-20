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

const DeliveryDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return (
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
                  {/* Active Trip */}
                  <div className="lg:col-span-2 space-y-6">
                      <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter">
                        <Navigation className="h-6 w-6 text-[#c9a84c] animate-pulse" /> 
                        OFFERED ASSIGNMENTS
                      </h2>
                      
                      {/* Active Order Card */}
                      <Card className="bg-[#111111] border-2 border-dashed border-[#c9a84c]/30 rounded-3xl overflow-hidden">
                        <CardHeader className="p-6 border-b border-[#1e1e1e] bg-[#c9a84c]/5">
                          <div className="flex justify-between items-center mb-4">
                            <Badge className="bg-[#c9a84c] text-black font-black text-[10px] px-3 rounded-lg">NEW ASSIGNMENT</Badge>
                            <span className="text-[11px] font-black text-white uppercase tracking-widest">₹140 EARNING</span>
                          </div>
                          <CardTitle className="text-2xl font-black tracking-tighter">Burger King → Saibaba Colony</CardTitle>
                          <CardDescription className="text-gray-400 font-medium">Estimated Distance: 3.2 km · Time: 15 mins</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-col gap-6 mb-8 relative">
                               {/* Timeline dots */}
                               <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#c9a84c] to-blue-500"></div>
                               
                               <div className="flex gap-4 relative">
                                  <div className="h-4 w-4 rounded-full bg-[#c9a84c] shadow-[0_0_10px_#c9a84c] z-10 shrink-0 mt-1"></div>
                                  <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">PICKUP STORE</p>
                                    <p className="text-lg font-bold text-white leading-tight">Burger King (Brookfields Mall)</p>
                                  </div>
                               </div>

                               <div className="flex gap-4 relative">
                                  <div className="h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] z-10 shrink-0 mt-1"></div>
                                  <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">DELIVERY POINT</p>
                                    <p className="text-lg font-bold text-white leading-tight">No 42, 7th Cross, Saibaba Colony</p>
                                  </div>
                               </div>
                            </div>

                            <div className="flex gap-3">
                              <Button className="flex-1 bg-[#c9a84c] text-black hover:bg-[#b8943d] rounded-2xl h-14 font-black shadow-xl shadow-[#c9a84c]/10">
                                ACCEPT ASSIGNMENT
                              </Button>
                              <Button variant="outline" className="h-14 w-14 rounded-2xl border-[#2a2a2a] text-red-500 hover:bg-red-500/10">
                                <Shield className="h-6 w-6" />
                              </Button>
                            </div>
                        </CardContent>
                      </Card>
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
