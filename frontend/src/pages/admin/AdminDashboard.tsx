import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, CheckCircle, XCircle, Store, Truck, 
  MessageSquare, Plus, ShoppingBag, Users, 
  TrendingUp, LogOut, ExternalLink, ShieldCheck,
  Loader2, AlertCircle, MapPin, Navigation, Eye,
  FileText, Mail
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Header from "@/components/layout/Header";
import MapView from "@/components/MapView";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [partners, setPartners] = useState<any[]>([]);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [livePartners, setLivePartners] = useState<any[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<any>(null);
    
    // New Restaurant Form State
    const [newRest, setNewRest] = useState({ name: "", cuisine: "", location: "", image: "" });
    const [isAddingRest, setIsAddingRest] = useState(false);
    const [foodFilter, setFoodFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

    const fetchData = async () => {
        try {
            const [partnersRes, restaurantsRes, ticketsRes, statsRes, ordersRes] = await Promise.all([
                api.get('/admin/partners'),
                api.get('/admin/restaurants'),
                api.get('/admin/support'),
                api.get('/admin/stats'),
                api.get('/admin/orders')
            ]);
            setPartners(partnersRes);
            setRestaurants(restaurantsRes);
            setTickets(ticketsRes);
            setStats(statsRes);
            setOrders(ordersRes);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const fetchLiveTracking = async () => {
        try {
            const res = await api.get('/admin/live-tracking');
            if (res.success) {
                setLivePartners(res.partners);
            }
        } catch (e) {
            console.error("Failed to fetch live tracking", e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-refresh live tracking every 5 seconds
    useEffect(() => {
        fetchLiveTracking();
        const timer = setInterval(fetchLiveTracking, 5000);
        return () => clearInterval(timer);
    }, []);

    // --- PARTNER ACTIONS ---
    const approvePartner = async (id: number) => {
        try {
            await api.post(`/admin/approve-partner/${id}`, {});
            toast.success("Partner approved! Email notification sent.");
            fetchData();
        } catch (e) { toast.error("Action failed"); }
    };

    const denyPartner = async (id: number) => {
        if (!confirm("Deny and remove this partner? An email will be sent.")) return;
        try {
            await api.delete(`/admin/deny-partner/${id}`);
            toast.success("Partner removed. Denial email sent.");
            fetchData();
        } catch (e) { toast.error("Action failed"); }
    };

    // --- RESTAURANT ACTIONS ---
    const deleteRestaurant = async (id: number) => {
        if (!confirm("Delete this restaurant?")) return;
        try {
            await api.delete(`/admin/restaurant/${id}`);
            toast.success("Restaurant deleted");
            fetchData();
        } catch (e) { toast.error("Action failed"); }
    };

    const addRestaurant = async () => {
        if (!newRest.name || !newRest.location) {
            toast.error("Name and Location are required");
            return;
        }
        try {
            await api.post('/admin/restaurant/add', newRest);
            toast.success("Restaurant added");
            setNewRest({ name: "", cuisine: "", location: "", image: "" });
            setIsAddingRest(false);
            fetchData();
        } catch (e) { toast.error("Failed to add restaurant"); }
    };

    // --- LOGOUT ---
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[#c9a84c]">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="font-bold tracking-widest text-sm uppercase">Accessing Command Center...</p>
        </div>
      </div>
    );

    const onlinePartners = livePartners.filter(p => p.is_online);
    const offlinePartners = livePartners.filter(p => !p.is_online);

    return (
        <div className="min-h-screen bg-[#0d0d0d] pb-20 text-white font-sans">
            <Header />
            
            <div className="container py-8">
              {/* Header Section */}
              <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-[#c9a84c] flex items-center justify-center text-black">
                          <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter">Command Center</h1>
                      </div>
                      <p className="text-gray-500 font-medium italic">Global Platform Management & Real-time Analytics</p>
                  </div>
                  <div className="flex items-center gap-3">
                      <Button onClick={() => navigate("/")} variant="outline" className="border-[#2a2a2a] bg-transparent text-white hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/50 rounded-xl h-11 px-6">
                          Storefront
                      </Button>
                      <Button onClick={handleLogout} variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl h-11 px-6 font-bold flex gap-2">
                          <LogOut className="h-4 w-4" /> Logout
                      </Button>
                  </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {[
                    { label: "Total Revenue", value: `₹${stats?.revenue?.toLocaleString() || 0}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "Active Orders", value: stats?.orders, icon: ShoppingBag, color: "text-[#c9a84c]", bg: "bg-[#c9a84c]/10" },
                    { label: "Elite Users", value: stats?.users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Online Riders", value: `${stats?.online_partners || 0}/${stats?.delivery_partners || 0}`, icon: Truck, color: "text-purple-500", bg: "bg-purple-500/10" },
                  ].map((s, i) => (
                    <Card key={i} className="bg-[#111111] border-[#2a2a2a] overflow-hidden group hover:border-[#c9a84c]/30 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{s.label}</p>
                            <p className="text-2xl font-black text-white">{s.value}</p>
                          </div>
                          <div className={`h-12 w-12 rounded-2xl ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <s.icon className={`h-6 w-6 ${s.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              <Tabs defaultValue="tracking" className="w-full">
                  <TabsList className="bg-[#111111] p-1 border border-[#2a2a2a] rounded-2xl h-auto mb-8 flex flex-wrap justify-start">
                      <TabsTrigger value="tracking" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-[#c9a84c] data-[state=active]:text-black font-bold flex gap-2">
                          <Navigation className="h-4 w-4" /> Live Tracking
                          <span className="bg-green-500/20 text-green-500 rounded-md px-1.5 py-0.5 text-[10px] font-black">
                            {onlinePartners.length}
                          </span>
                      </TabsTrigger>
                      <TabsTrigger value="partners" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-[#c9a84c] data-[state=active]:text-black font-bold flex gap-2">
                          <Truck className="h-4 w-4" /> Partners
                          <span className="bg-[#c9a84c]/20 text-[#c9a84c] rounded-md px-1.5 py-0.5 text-[10px] font-black">
                            {partners.filter(p => !p.is_approved).length}
                          </span>
                      </TabsTrigger>
                      <TabsTrigger value="restaurants" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-[#c9a84c] data-[state=active]:text-black font-bold flex gap-2">
                          <Store className="h-4 w-4" /> Restaurants
                      </TabsTrigger>
                      <TabsTrigger value="orders" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-[#c9a84c] data-[state=active]:text-black font-bold flex gap-2">
                          <ShoppingBag className="h-4 w-4" /> Recent Orders
                      </TabsTrigger>
                      <TabsTrigger value="support" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-[#c9a84c] data-[state=active]:text-black font-bold flex gap-2">
                          <MessageSquare className="h-4 w-4" /> Support
                          <span className="bg-[#c9a84c]/20 text-[#c9a84c] rounded-md px-1.5 py-0.5 text-[10px] font-black">
                             {tickets.filter(t => t.status === 'open').length}
                          </span>
                      </TabsTrigger>
                  </TabsList>

                  {/* === LIVE TRACKING TAB === */}
                  <TabsContent value="tracking">
                      <div className="grid gap-6 lg:grid-cols-3">
                          {/* Map - Full width on mobile, 2/3 on desktop */}
                          <div className="lg:col-span-2">
                              <Card className="bg-[#111111] border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl">
                                  <CardHeader className="border-b border-[#1e1e1e] p-4">
                                      <div className="flex items-center justify-between">
                                          <div>
                                              <CardTitle className="text-xl font-black flex items-center gap-2">
                                                  <Navigation className="h-5 w-5 text-[#c9a84c] animate-pulse" />
                                                  Live Fleet Map
                                              </CardTitle>
                                              <CardDescription className="text-gray-500">
                                                  All delivery partner locations in real-time
                                              </CardDescription>
                                          </div>
                                          <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg py-1 px-3 animate-pulse">
                                              {onlinePartners.length} ONLINE
                                          </Badge>
                                      </div>
                                  </CardHeader>
                                  <CardContent className="p-0">
                                      <div className="w-full h-[500px]">
                                          <MapView
                                              height="100%"
                                              width="100%"
                                              zoom={12}
                                              center={onlinePartners.length > 0 
                                                  ? [onlinePartners[0].live_latitude, onlinePartners[0].live_longitude] 
                                                  : [11.0168, 76.9558]}
                                              popupText="Delivery Fleet"
                                          />
                                      </div>
                                  </CardContent>
                              </Card>
                          </div>

                          {/* Partners List */}
                          <div className="space-y-4">
                              <h3 className="text-lg font-black flex items-center gap-2">
                                  <Eye className="h-5 w-5 text-[#c9a84c]" />
                                  Fleet Status ({livePartners.length})
                              </h3>

                              {/* Online Partners */}
                              {onlinePartners.map(p => (
                                  <Card key={p.id} className="bg-[#111111] border-green-500/20 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all cursor-pointer"
                                      onClick={() => setSelectedPartner(p)}>
                                      <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                                  <Truck className="h-5 w-5 text-green-500" />
                                              </div>
                                              <div className="flex-1">
                                                  <p className="font-bold text-white text-sm">{p.name || `Partner #${p.id}`}</p>
                                                  <p className="text-[10px] text-gray-500">{p.email}</p>
                                              </div>
                                              <div className="text-right">
                                                  <Badge className="bg-green-500/10 text-green-500 text-[9px] font-black">ONLINE</Badge>
                                                  <p className="text-[9px] text-gray-600 mt-1 font-mono">
                                                      {p.live_latitude?.toFixed(4)}, {p.live_longitude?.toFixed(4)}
                                                  </p>
                                              </div>
                                          </div>
                                      </CardContent>
                                  </Card>
                              ))}

                              {/* Offline Partners */}
                              {offlinePartners.map(p => (
                                  <Card key={p.id} className="bg-[#111111] border-[#2a2a2a] rounded-2xl overflow-hidden opacity-50">
                                      <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                              <div className="h-10 w-10 rounded-full bg-gray-500/10 flex items-center justify-center">
                                                  <Truck className="h-5 w-5 text-gray-500" />
                                              </div>
                                              <div className="flex-1">
                                                  <p className="font-bold text-gray-400 text-sm">{p.name || `Partner #${p.id}`}</p>
                                                  <p className="text-[10px] text-gray-600">{p.email}</p>
                                              </div>
                                              <Badge className="bg-gray-500/10 text-gray-500 text-[9px] font-black">OFFLINE</Badge>
                                          </div>
                                      </CardContent>
                                  </Card>
                              ))}

                              {livePartners.length === 0 && (
                                  <div className="p-8 text-center text-gray-500 border border-[#2a2a2a] rounded-2xl">
                                      <Truck className="h-10 w-10 mx-auto mb-3 opacity-30" />
                                      <p className="font-bold">No delivery partners with location data</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </TabsContent>

                  {/* --- DELIVERY PARTNERS TAB --- */}
                  <TabsContent value="partners">
                      <Card className="bg-[#111111] border-[#2a2a2a] text-white rounded-3xl overflow-hidden shadow-2xl">
                          <CardHeader className="border-b border-[#1e1e1e] p-6">
                              <CardTitle className="text-xl font-black">Partner Onboarding</CardTitle>
                              <CardDescription className="text-gray-500 font-medium">
                                  Verify driving licenses and activate new delivery partners. Approval/denial emails are sent automatically.
                              </CardDescription>
                          </CardHeader>
                          <CardContent className="p-0">
                              <Table>
                                  <TableHeader className="bg-[#0d0d0d]">
                                      <TableRow className="border-[#1e1e1e] hover:bg-transparent">
                                          <TableHead className="text-gray-500 font-bold px-6">PARTNER</TableHead>
                                          <TableHead className="text-gray-500 font-bold">CONTACT</TableHead>
                                          <TableHead className="text-gray-500 font-bold">LICENSE</TableHead>
                                          <TableHead className="text-gray-500 font-bold">STATUS</TableHead>
                                          <TableHead className="text-gray-500 font-bold text-right px-6">ACTIONS</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {partners.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="h-32 text-center text-gray-500">No partners found.</TableCell></TableRow>
                                      ) : partners.map((partner) => (
                                          <TableRow key={partner.id} className="border-[#1e1e1e] hover:bg-white/[0.02] transition-colors">
                                              <TableCell className="px-6">
                                                <div className="font-bold text-white">{partner.name}</div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-tighter">ID: #DP-000{partner.id}</div>
                                                {partner.is_online && (
                                                    <Badge className="bg-green-500/10 text-green-500 text-[8px] mt-1">● ONLINE</Badge>
                                                )}
                                              </TableCell>
                                              <TableCell>
                                                <div className="text-sm text-gray-300">{partner.email}</div>
                                                <div className="text-xs text-gray-600">{partner.phone || 'No phone'}</div>
                                              </TableCell>
                                              <TableCell>
                                                {partner.driving_license ? (
                                                    <div>
                                                        <div className="flex items-center gap-1 text-xs text-blue-400">
                                                            <FileText className="h-3 w-3" />
                                                            {partner.driving_license}
                                                        </div>
                                                        {partner.driving_license_image && (
                                                            <a href={partner.driving_license_image} target="_blank" className="text-[9px] text-[#c9a84c] hover:underline">View Image</a>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-red-500 font-bold">NO LICENSE</span>
                                                )}
                                              </TableCell>
                                              <TableCell>
                                                  {partner.is_approved ? (
                                                      <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg py-1 px-3">ACTIVE</Badge>
                                                  ) : (
                                                      <Badge className="bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg py-1 px-3">PENDING</Badge>
                                                  )}
                                              </TableCell>
                                              <TableCell className="text-right px-6">
                                                  <div className="flex justify-end gap-2">
                                                      {!partner.is_approved && (
                                                          <Button size="sm" className="bg-[#c9a84c] text-black hover:bg-[#b8943d] h-9 px-3 rounded-xl flex gap-1 items-center" onClick={() => approvePartner(partner.id)}>
                                                              <CheckCircle className="h-4 w-4" />
                                                              <Mail className="h-3 w-3" />
                                                          </Button>
                                                      )}
                                                      <Button size="sm" variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white h-9 px-3 rounded-xl border border-red-500/20 flex gap-1 items-center" onClick={() => denyPartner(partner.id)}>
                                                          <XCircle className="h-4 w-4" />
                                                          <Mail className="h-3 w-3" />
                                                      </Button>
                                                  </div>
                                              </TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </CardContent>
                      </Card>
                  </TabsContent>

                  {/* --- RESTAURANTS TAB --- */}
                  <TabsContent value="restaurants">
                      <div className="flex justify-between items-center mb-6">
                           <div>
                            <h2 className="text-2xl font-black">All Restaurants</h2>
                            <p className="text-sm text-gray-500">Inventory and store management.</p>
                           </div>
                           <Dialog open={isAddingRest} onOpenChange={setIsAddingRest}>
                              <DialogTrigger asChild>
                                  <Button className="bg-[#c9a84c] text-black hover:bg-[#b8943d] rounded-2xl h-11 px-6 font-black">
                                      <Plus className="mr-2 h-5 w-5" /> ADD NEW STORE
                                  </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-[#111111] text-white border-[#2a2a2a] rounded-3xl p-8 max-w-md">
                                  <DialogHeader className="mb-6 text-center">
                                      <div className="mx-auto h-12 w-12 rounded-2xl bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] mb-4">
                                        <Plus className="h-6 w-6" />
                                      </div>
                                      <DialogTitle className="text-2xl font-black tracking-tighter">Add Restaurant</DialogTitle>
                                      <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">New Vendor Entry</p>
                                  </DialogHeader>
                                  <div className="space-y-5 py-4">
                                      <div className="space-y-2">
                                          <Label className="text-[10px] font-black uppercase text-gray-500 ml-1">Restaurant Name</Label>
                                          <Input value={newRest.name} onChange={(e) => setNewRest({...newRest, name: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c]" placeholder="e.g. Burger King" />
                                      </div>
                                      <div className="space-y-2">
                                          <Label className="text-[10px] font-black uppercase text-gray-500 ml-1">Cuisine Type</Label>
                                          <Input value={newRest.cuisine} onChange={(e) => setNewRest({...newRest, cuisine: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c]" placeholder="e.g. American, Fast Food" />
                                      </div>
                                      <div className="space-y-2">
                                          <Label className="text-[10px] font-black uppercase text-gray-500 ml-1">Store Location</Label>
                                          <Input value={newRest.location} onChange={(e) => setNewRest({...newRest, location: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c]" placeholder="e.g. Saravanampatti, Coimbatore" />
                                      </div>
                                      <div className="space-y-2">
                                          <Label className="text-[10px] font-black uppercase text-gray-500 ml-1">Image URL</Label>
                                          <Input value={newRest.image} onChange={(e) => setNewRest({...newRest, image: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c]" placeholder="https://..." />
                                      </div>
                                      <Button onClick={addRestaurant} className="w-full bg-[#c9a84c] text-black hover:bg-[#b8943d] h-14 rounded-2xl font-black text-lg shadow-xl shadow-[#c9a84c]/10">SAVE RESTAURANT</Button>
                                  </div>
                              </DialogContent>
                           </Dialog>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {restaurants.map(r => (
                              <Card key={r.id} className="bg-[#111111] border-[#2a2a2a] text-white rounded-3xl overflow-hidden hover:border-[#c9a84c]/20 transition-all">
                                  <div className="h-40 bg-[#1a1a1a] overflow-hidden relative group">
                                    <img src={r.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80'} alt={r.name} className="h-full w-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4">
                                      <Badge className="bg-[#c9a84c] text-black font-black flex gap-1 items-center px-3 rounded-lg border-none shadow-lg shadow-black">
                                        {r.rating || 4.5} <span className="text-[8px]">★</span>
                                      </Badge>
                                    </div>
                                  </div>
                                  <CardHeader className="pb-2">
                                      <CardTitle className="text-xl font-black tracking-tight">{r.name}</CardTitle>
                                      <CardDescription className="text-gray-500 font-bold uppercase text-[10px] tracking-widest leading-none">{r.cuisine}</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-6">
                                        <MapPin className="h-3 w-3 text-[#c9a84c]" /> {r.location}
                                      </div>
                                      <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            className="flex-1 border-[#2a2a2a] text-white hover:bg-white/5 rounded-xl h-10 px-0 font-bold text-xs gap-2"
                                            onClick={() => navigate(`/restaurant/${r.id}`)}
                                        >
                                            <ExternalLink className="h-3.3 w-3.3" /> VIEW
                                        </Button>
                                        <Button variant="destructive" className="h-10 w-10 p-0 rounded-xl" onClick={() => deleteRestaurant(r.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                  </CardContent>
                              </Card>
                          ))}
                      </div>
                  </TabsContent>

                  {/* --- RECENT ORDERS TAB --- */}
                  <TabsContent value="orders">
                      <Card className="bg-[#111111] border-[#2a2a2a] text-white rounded-3xl overflow-hidden shadow-2xl">
                          <div className="flex justify-between items-center mb-6 px-6 pt-6">
                          <div>
                              <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Fleet Activity</CardTitle>
                              <CardDescription className="text-gray-500 font-medium">Monitoring all active logistics and transactions.</CardDescription>
                          </div>
                          <div className="flex gap-2 bg-[#0d0d0d] p-1 rounded-xl border border-[#1e1e1e]">
                              {['all', 'veg', 'non-veg'].map((f) => (
                                  <button
                                      key={f}
                                      onClick={() => setFoodFilter(f as any)}
                                      className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${foodFilter === f ? 'bg-[#c9a84c] text-black shadow-lg shadow-[#c9a84c]/20' : 'text-gray-500 hover:text-white'}`}
                                  >
                                      {f}
                                  </button>
                              ))}
                          </div>
                      </div>
                      <CardContent className="p-0">
                                <Table>
                                  <TableHeader className="bg-[#0d0d0d]">
                                      <TableRow className="border-[#1e1e1e] hover:bg-transparent">
                                          <TableHead className="text-gray-500 font-bold px-6">ORDER ID</TableHead>
                                          <TableHead className="text-gray-500 font-bold">CUSTOMER</TableHead>
                                          <TableHead className="text-gray-500 font-bold">RESTAURANT</TableHead>
                                          <TableHead className="text-gray-500 font-bold text-right px-6">TOTAL</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {orders.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} className="h-32 text-center text-gray-500">No orders placed yet.</TableCell></TableRow>
                                      ) : orders.map((o) => (
                                          <TableRow key={o.id} className="border-[#1e1e1e] hover:bg-white/[0.02] transition-colors">
                                              <TableCell className="px-6">
                                                <div className="font-mono text-[11px] text-[#c9a84c]">#FD-000{o.id}</div>
                                                <div className="text-[10px] text-gray-600 uppercase font-black">{new Date(o.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                              </TableCell>
                                              <TableCell>
                                                <div className="font-bold text-white text-sm">{o.user_name}</div>
                                                <Badge className={`px-1.5 py-0 rounded text-[9px] mt-1 font-black ${o.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                                  {o.status?.toUpperCase()}
                                                </Badge>
                                              </TableCell>
                                              <TableCell>
                                                <div className="font-medium text-gray-300 text-sm italic underline underline-offset-4 decoration-[#c9a84c]/20">{o.restaurant_name}</div>
                                              </TableCell>
                                              <TableCell className="text-right px-6">
                                                  <div className="font-black text-white">₹{o.total_amount}</div>
                                                  <div className="text-[9px] text-gray-600 font-bold uppercase">{o.payment_method}</div>
                                              </TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </CardContent>
                      </Card>
                  </TabsContent>

                  {/* --- SUPPORT TAB --- */}
                  <TabsContent value="support">
                      <Card className="bg-[#111111] border-[#2a2a2a] text-white rounded-3xl overflow-hidden shadow-2xl">
                          <CardHeader className="border-b border-[#1e1e1e] p-6">
                              <CardTitle className="text-xl font-black">Support Nexus</CardTitle>
                              <CardDescription className="text-gray-500 font-medium">Resolving user queries and system issues.</CardDescription>
                          </CardHeader>
                          <CardContent className="p-0">
                               <Table>
                                  <TableHeader className="bg-[#0d0d0d]">
                                      <TableRow className="border-[#1e1e1e] hover:bg-transparent">
                                          <TableHead className="text-gray-500 font-bold px-6">USER</TableHead>
                                          <TableHead className="text-gray-500 font-bold">ISSUE</TableHead>
                                          <TableHead className="text-gray-500 font-bold px-6 text-right">ACTION</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {tickets.length === 0 ? (
                                        <TableRow><TableCell colSpan={3} className="h-32 text-center text-gray-500">No support tickets.</TableCell></TableRow>
                                      ) : tickets.map((t) => (
                                          <TableRow key={t.id} className="border-[#1e1e1e] hover:bg-white/[0.02] transition-colors">
                                              <TableCell className="px-6">
                                                  <div className="font-bold text-white text-sm">{t.user_name}</div>
                                                  <div className="text-[10px] text-gray-600 font-bold truncate max-w-[140px]">{t.user_email}</div>
                                              </TableCell>
                                              <TableCell>
                                                <div className="font-black text-[#c9a84c] text-xs uppercase tracking-tight">{t.subject}</div>
                                                <div className="text-xs text-gray-500 italic max-w-sm truncate" title={t.message}>{t.message}</div>
                                              </TableCell>
                                              <TableCell className="px-6 text-right">
                                                  {t.status === 'open' ? (
                                                       <Button size="sm" className="bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white rounded-xl h-9 px-4 font-black transition-all" onClick={async () => {
                                                            await api.post(`/admin/support/resolve/${t.id}`, {});
                                                            toast.success("Ticket resolved");
                                                            fetchData();
                                                        }}>
                                                          RESOLVE
                                                      </Button>
                                                  ) : (
                                                    <div className="flex items-center justify-end text-green-500 gap-1 text-[10px] font-black">
                                                      <CheckCircle className="h-3 w-3" /> RESOLVED
                                                    </div>
                                                  )}
                                              </TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </CardContent>
                      </Card>
                  </TabsContent>
              </Tabs>
            </div>
        </div>
    );
};

export default AdminDashboard;
