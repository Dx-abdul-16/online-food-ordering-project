import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, Clock, User as UserIcon, LogOut, ChevronRight, Loader2, MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import { api } from "@/lib/api";

interface UserData {
    id: number;
    username: string;
    role: string;
    name?: string;
    email?: string;
}

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserData(user);
                fetchUserOrders(user.id);
            } catch (error) {
                console.error('Error parsing user data:', error);
                setLoading(false);
            }
        } else {
             navigate('/login');
        }
    }, [navigate]);

    const fetchUserOrders = async (userId: number) => {
        try {
            const res = await api.get(`/orders/user/${userId}`);
            if (Array.isArray(res)) {
                setOrders(res);
            }
        } catch (error) {
            console.error("Failed to fetch orders:");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#c9a84c]" />
      </div>
    );

    const displayName = userData?.name || userData?.username || 'User';

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-sans pb-20">
            <Header />
            
            <div className="container py-8">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <UserIcon className="h-6 w-6 text-[#c9a84c]" />
                            <h1 className="text-3xl font-black tracking-tighter">My Account</h1>
                        </div>
                        <p className="text-gray-500 font-medium tracking-tight">Welcome back, <span className="text-white font-black">{displayName}</span>!</p>
                        {userData?.username && (
                            <p className="text-[#c9a84c] tracking-widest uppercase font-bold text-[10px] mt-2 border-b border-[#c9a84c]/20 pb-1">@ {userData.username}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => navigate("/restaurants")} variant="outline" className="border-[#2a2a2a] bg-transparent text-white hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/50 rounded-xl h-11 px-6 font-bold shadow-lg shadow-transparent transition-all">
                            ORDER FOOD
                        </Button>
                        <Button onClick={handleLogout} variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl h-11 px-6 font-bold flex gap-2 shadow-lg shadow-red-500/5 transition-all">
                            <LogOut className="h-4 w-4" /> SIGN OUT
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {[
                      { title: "Active Orders", value: orders.filter(o => o.status !== 'delivered').length.toString(), icon: ShoppingBag, color: "text-[#c9a84c]", bg: "bg-[#c9a84c]/10", desc: "Arriving soon" },
                      { title: "Favorite Spots", value: "0", icon: Star, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Saved restaurants" },
                      { title: "Total Orders", value: orders.length.toString(), icon: Clock, color: "text-green-500", bg: "bg-green-500/10", desc: "Lifetime orders" },
                    ].map((s, i) => (
                        <Card key={i} className="bg-[#111111] border-[#2a2a2a] rounded-3xl group hover:border-[#c9a84c]/30 transition-all overflow-hidden h-full shadow-2xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-500">{s.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mt-2">
                                    <div>
                                      <div className="text-3xl font-black text-white">{s.value}</div>
                                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight mt-1">{s.desc}</p>
                                    </div>
                                    <div className={`h-14 w-14 rounded-2xl ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                      <s.icon className={`h-7 w-7 ${s.color}`} />
                                    </div>
                                </div>
                                {i === 0 && orders.filter(o => o.status !== 'delivered').length > 0 && (
                                   <Button 
                                      className="w-full mt-6 bg-[#c9a84c] text-black hover:bg-[#b8943d] rounded-xl font-black h-12 shadow-lg shadow-[#c9a84c]/20 tracking-widest text-xs"
                                      onClick={() => navigate(`/track-order?orderId=${orders.filter(o => o.status !== 'delivered')[0].id}`)}
                                   >
                                      TRACK LIVE LOCATION
                                   </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Orders List */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black tracking-tighter">Recent History</h2>
                    </div>
                    
                    {orders.length === 0 ? (
                        <div className="rounded-3xl bg-[#111111] border border-[#2a2a2a] p-8 text-center flex flex-col items-center justify-center min-h-[300px] shadow-2xl">
                            <div className="h-20 w-20 rounded-full bg-[#1e1e1e] flex items-center justify-center mb-6 border border-[#2a2a2a]">
                               <ShoppingBag className="h-10 w-10 text-gray-700" />
                            </div>
                            <h3 className="text-2xl font-black text-white tracking-tighter mb-2">No recent orders</h3>
                            <p className="text-sm text-gray-500 mb-8 max-w-sm font-medium leading-relaxed">You haven't placed any orders recently. Start exploring the best restaurants in Saravanampatti!</p>
                            <Button onClick={() => navigate("/restaurants")} className="bg-[#c9a84c] text-black hover:bg-[#b8943d] rounded-2xl font-black h-14 px-10 shadow-xl shadow-[#c9a84c]/20 tracking-tighter text-lg">
                                DISCOVER FOOD
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {orders.map((order) => (
                                <Card key={order.id} className="bg-[#111111] border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl hover:border-[#c9a84c]/30 transition-all cursor-pointer" onClick={() => navigate(`/track-order?orderId=${order.id}`)}>
                                    <div className="h-24 w-full relative">
                                        <img src={order.restaurant_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={order.restaurant_name} className="w-full h-full object-cover opacity-50" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent"></div>
                                        <div className="absolute bottom-3 left-4">
                                            <h3 className="text-lg font-black text-white leading-tight truncate w-full pr-4">{order.restaurant_name}</h3>
                                        </div>
                                    </div>
                                    <CardContent className="p-5 pt-2">
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="text-xs text-gray-500 font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                                            <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-widest ${
                                                order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                                order.status === 'pending' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 
                                                'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20'
                                            }`}>
                                                {order.status.replace("_", " ")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-4 text-xs font-medium text-gray-400">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span className="truncate">{order.delivery_address || 'Customer Location'}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-[#1e1e1e] pt-3 mt-1">
                                            <span className="text-sm font-bold text-gray-300">Total</span>
                                            <span className="text-lg font-black text-white">₹{order.total_amount}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
