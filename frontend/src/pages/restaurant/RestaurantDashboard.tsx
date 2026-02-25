import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Utensils, DollarSign, ListOrdered, Trash2, Plus, 
  Leaf, MapPin, ChefHat, ShoppingBag, Clock, 
  CheckCircle2, Loader2, LogOut, ExternalLink,
  ChevronRight, Upload, Pencil
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Header from "@/components/layout/Header";

const RestaurantDashboard = () => {
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [menu, setMenu] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        description: "",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        isVeg: true,
        stock: "50",
        discount: "0"
    });
    const [isAdding, setIsAdding] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    const loadData = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) { navigate('/login'); return; }
        
        const user = JSON.parse(userStr);
        // Correcting role check
        if (user.role !== 'restaurant' && user.role !== 'hotel') {
            navigate('/');
            return;
        }

        try {
            const data = await api.get(`/restaurants/owner/${user.id}`);
            setRestaurant(data);
            if (data && data.menu) {
                setMenu(data.menu);
            }
            
            // Fetch Orders
            const ordersRes = await api.get(`/restaurants/orders/${data.id}`);
            setOrders(ordersRes);
        } catch (error) {
            console.error("Fetch error:", error);
            // toast.error("Could not load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await api.upload('/uploads/image', formData);
            if (res.success && res.url) {
                const fullUrl = `https://online-food-ordering-project-production.up.railway.app${res.url}`;
                if (editingItem) {
                    setEditingItem({ ...editingItem, image: fullUrl });
                } else {
                    setNewItem({ ...newItem, image: fullUrl });
                }
                toast.success("Image uploaded!");
            }
        } catch (error) {
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleAddItem = async () => {
        if (!restaurant) return;
        try {
            const res = await api.post(`/restaurants/menu/${restaurant.id}`, {
                ...newItem,
                price: parseFloat(newItem.price),
                stock: parseInt(newItem.stock),
                discount: parseInt(newItem.discount)
            });
            
            if (res.success) {
                toast.success("Item added successfully");
                setIsAdding(false);
                setNewItem({
                    name: "", 
                    price: "", 
                    description: "", 
                    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", 
                    isVeg: true,
                    stock: "50",
                    discount: "0"
                });
                loadData();
            }
        } catch (error) {
           toast.error("Failed to add item");
        }
    };

    const handleEditItem = async () => {
        if (!editingItem) return;
        try {
            const res = await api.put(`/restaurants/menu/edit/${editingItem.id}`, {
                name: editingItem.name,
                price: parseFloat(editingItem.price),
                description: editingItem.description,
                image: editingItem.image,
                isVeg: editingItem.isVeg
            });
            if (res.success) {
                toast.success("Item updated!");
                setEditingItem(null);
                loadData();
            }
        } catch (error) {
            toast.error("Failed to update item");
        }
    };

    const updateStatus = async (orderId: number, status: string) => {
      try {
        const res = await api.post('/restaurants/order/status', { orderId, status });
        if (res.success) {
          toast.success(`Order set to ${status}`);
          loadData();
        }
      } catch { toast.error("Status update failed"); }
    }

    if (loading) return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#c9a84c]" />
      </div>
    );

    if (!restaurant) return (
        <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center p-8 text-center">
            <ChefHat className="h-16 w-16 text-gray-800 mb-6" />
            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Kitchen Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-sm">You profile is not currently linked to a physical store. Please contact the administrator.</p>
            <Button onClick={handleLogout} variant="outline" className="border-[#2a2a2a] text-white rounded-xl px-10">Logout</Button>
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
                        <ChefHat className="h-6 w-6 text-[#c9a84c]" />
                        <h1 className="text-3xl font-black tracking-tighter">Kitchen Manager</h1>
                      </div>
                      <p className="text-gray-500 font-medium">Managing: <span className="text-[#c9a84c] border-b border-[#c9a84c]/30">{restaurant.name}</span></p>
                  </div>
                  <div className="flex gap-2">
                      <Button onClick={handleLogout} variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl h-11 px-6 font-bold flex gap-2">
                          <LogOut className="h-4 w-4" /> Sign Out
                      </Button>
                  </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                  { label: "Menu Items", value: menu.length, icon: Utensils, color: "text-orange-500", bg: "bg-orange-500/10" },
                  { label: "Kitchen Rating", value: `${restaurant.rating} ★`, icon: ChefHat, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                  { label: "Active Orders", value: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length, icon: ShoppingBag, color: "text-[#c9a84c]", bg: "bg-[#c9a84c]/10" },
                ].map((s, i) => (
                    <Card key={i} className="bg-[#111111] border-[#2a2a2a] rounded-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{s.label}</p>
                            <p className="text-2xl font-black text-white">{s.value}</p>
                          </div>
                          <div className={`h-12 w-12 rounded-2xl ${s.bg} flex items-center justify-center`}>
                            <s.icon className={`h-6 w-6 ${s.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>

              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-1 mb-8 h-auto flex justify-start">
                    <TabsTrigger value="orders" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-[#c9a84c] data-[state=active]:text-black font-bold flex gap-2">
                        <ListOrdered className="h-4 w-4" /> LIVE ORDERS
                    </TabsTrigger>
                    <TabsTrigger value="menu" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-[#c9a84c] data-[state=active]:text-black font-bold flex gap-2">
                        <Utensils className="h-4 w-4" /> MENU CONTROL
                    </TabsTrigger>
                </TabsList>

                {/* --- LIVE ORDERS TAB --- */}
                <TabsContent value="orders">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {orders.filter(o => o.status !== 'delivered').map((o) => (
                            <Card key={o.id} className={`bg-[#111111] border-[#2a2a2a] rounded-3xl overflow-hidden transition-all ${o.status === 'pending' ? 'ring-2 ring-orange-500/20 border-orange-500/30' : ''}`}>
                                <CardHeader className="pb-4 border-b border-[#1e1e1e]">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-[#c9a84c] uppercase tracking-widest">Order ID</span>
                                        <span className="font-black text-xl italic tracking-tighter">#FD-000{o.id}</span>
                                      </div>
                                      <Badge className={`${o.status === 'pending' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'} border-none font-black text-[10px] uppercase rounded-lg`}>
                                        {o.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <Clock className="h-3 w-3" /> {new Date(o.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      <span className="mx-1">•</span>
                                      <span className="text-white font-bold tracking-tight">👤 {o.user_name}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3 mb-6">
                                        {o.items?.map((item: any, idx: number) => (
                                          <div key={idx} className="flex justify-between items-center bg-[#0d0d0d] p-3 rounded-xl border border-[#1e1e1e]">
                                            <span className="text-sm font-bold text-gray-300">{item.name}</span>
                                            <span className="h-6 w-6 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] flex items-center justify-center text-[11px] font-black border border-[#c9a84c]/20">x{item.quantity}</span>
                                          </div>
                                        ))}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      {o.status === 'pending' ? (
                                        <Button className="w-full bg-[#c9a84c] text-black hover:bg-[#b8943d] font-black rounded-xl h-12" onClick={() => updateStatus(o.id, 'preparing')}>
                                          START PREPARING
                                        </Button>
                                      ) : (
                                        <Button className="w-full bg-green-500 text-white hover:bg-green-600 font-black rounded-xl h-12 flex gap-2" onClick={() => updateStatus(o.id, 'delivered')}>
                                          <CheckCircle2 className="h-5 w-5" /> MARK AS READY
                                        </Button>
                                      )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {orders.filter(o => o.status !== 'delivered').length === 0 && (
                          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-[#111111] rounded-3xl border-2 border-dashed border-[#2a2a2a]">
                            <ShoppingBag className="h-10 w-10 text-gray-800 mb-4" />
                            <p className="text-gray-500 font-bold">No active orders in the kitchen.</p>
                          </div>
                        )}
                    </div>
                </TabsContent>

                {/* --- MENU TAB --- */}
                <TabsContent value="menu">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                        <h2 className="text-2xl font-black">Menu Inventory</h2>
                        <p className="text-sm text-gray-500 uppercase tracking-widest font-black text-[10px]">Dish Management</p>
                        </div>
                        
                        <Dialog open={isAdding} onOpenChange={setIsAdding}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#c9a84c] text-black hover:bg-[#b8943d] rounded-2xl h-12 px-8 font-black shadow-xl shadow-[#c9a84c]/10">
                                    <Plus className="mr-2 h-5 w-5" /> NEW DISH
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#111111] text-white border-[#2a2a2a] rounded-3xl p-8">
                                <DialogHeader className="mb-6">
                                    <DialogTitle className="text-2xl font-black tracking-tighter">New Menu Entry</DialogTitle>
                                    <DialogDescription className="text-gray-500 font-medium italic">Define the flavors and pricing for your new dish.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="uppercase text-[10px] font-black text-gray-500 ml-1">Dish Name</Label>
                                        <Input value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] rounded-xl h-12 focus:border-[#c9a84c] text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="uppercase text-[10px] font-black text-gray-500 ml-1">Price (₹)</Label>
                                        <Input type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] rounded-xl h-12 focus:border-[#c9a84c] text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="uppercase text-[10px] font-black text-gray-500 ml-1">Description</Label>
                                        <Input value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] rounded-xl h-12 focus:border-[#c9a84c] text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="uppercase text-[10px] font-black text-gray-500 ml-1">Dish Image</Label>
                                        <div className="flex gap-3 items-center">
                                            {newItem.image && <img src={newItem.image} alt="preview" className="h-16 w-16 rounded-xl object-cover border border-[#2a2a2a]" />}
                                            <label className="flex-1 cursor-pointer">
                                                <div className="flex items-center gap-2 justify-center bg-[#0d0d0d] border border-dashed border-[#2a2a2a] rounded-xl h-12 hover:border-[#c9a84c] transition-all text-gray-400 hover:text-[#c9a84c]">
                                                    <Upload className="h-4 w-4" />
                                                    <span className="text-xs font-bold">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                                                </div>
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="uppercase text-[10px] font-black text-gray-500 ml-1">Current Stock</Label>
                                            <Input type="number" value={newItem.stock} onChange={(e) => setNewItem({...newItem, stock: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] rounded-xl h-12 focus:border-[#c9a84c] text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="uppercase text-[10px] font-black text-gray-500 ml-1">Offer (%)</Label>
                                            <Input type="number" value={newItem.discount} onChange={(e) => setNewItem({...newItem, discount: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] rounded-xl h-12 focus:border-[#c9a84c] text-white" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#0d0d0d] p-4 rounded-2xl border border-[#2a2a2a] mt-4">
                                        <input type="checkbox" id="veg" checked={newItem.isVeg} onChange={(e) => setNewItem({...newItem, isVeg: e.target.checked})} className="h-5 w-5 accent-[#c9a84c] bg-[#111111]" />
                                        <Label htmlFor="veg" className="font-bold text-gray-300">Vegetarian Friendly?</Label>
                                    </div>
                                </div>
                                <Button onClick={handleAddItem} className="w-full bg-[#c9a84c] text-black hover:bg-[#b8943d] h-14 rounded-2xl font-black text-lg mt-8 shadow-xl shadow-[#c9a84c]/10">SAVE ENTRY</Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {menu.map((item) => (
                            <Card key={item.id} className="bg-[#111111] border-[#2a2a2a] text-white overflow-hidden rounded-3xl hover:border-[#c9a84c]/20 transition-all">
                                <div className="relative h-44 w-full">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover opacity-70" />
                                    <div className="absolute top-4 left-4">
                                      <Badge className="bg-black/60 backdrop-blur-md border border-white/10 text-[#c9a84c] font-black px-3 rounded-lg">
                                        ₹{item.price}
                                      </Badge>
                                    </div>
                                    {item.isVeg && (
                                        <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500/30 p-1.5 rounded-lg backdrop-blur-sm">
                                            <Leaf className="h-4 w-4 text-green-400" />
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-6">
                                    <div className="mb-4">
                                        <h3 className="font-black text-xl tracking-tight mb-1">{item.name}</h3>
                                        <p className="text-xs text-gray-500 font-medium italic line-clamp-2">{item.description}</p>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                      <Button variant="outline" className="flex-1 border-[#2a2a2a] text-white hover:bg-white/5 rounded-xl h-10 font-bold text-xs" onClick={() => setEditingItem({...item, price: String(item.price)})}>
                                          <Pencil className="h-3 w-3 mr-1" /> EDIT
                                      </Button>
                                      <Button variant="destructive" className="h-10 w-10 p-0 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white" onClick={async () => {
                                        if(!confirm("Erase this item?")) return;
                                        await api.delete(`/restaurants/menu/delete/${item.id}`);
                                        loadData();
                                      }}>
                                          <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* EDIT ITEM DIALOG */}
            <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
                <DialogContent className="bg-[#111111] text-white border-[#2a2a2a] rounded-3xl p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tighter">Edit Menu Item</DialogTitle>
                        <DialogDescription className="text-gray-500 font-medium italic">Update dish details.</DialogDescription>
                    </DialogHeader>
                    {editingItem && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="uppercase text-[10px] font-black text-gray-500 ml-1">Dish Name</Label>
                                <Input value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] rounded-xl h-12 focus:border-[#c9a84c] text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="uppercase text-[10px] font-black text-gray-500 ml-1">Price (₹)</Label>
                                <Input type="number" value={editingItem.price} onChange={(e) => setEditingItem({...editingItem, price: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] rounded-xl h-12 focus:border-[#c9a84c] text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="uppercase text-[10px] font-black text-gray-500 ml-1">Description</Label>
                                <Input value={editingItem.description || ""} onChange={(e) => setEditingItem({...editingItem, description: e.target.value})} className="bg-[#0d0d0d] border-[#2a2a2a] rounded-xl h-12 focus:border-[#c9a84c] text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label className="uppercase text-[10px] font-black text-gray-500 ml-1">Dish Image</Label>
                                <div className="flex gap-3 items-center">
                                    {editingItem.image && <img src={editingItem.image} alt="preview" className="h-16 w-16 rounded-xl object-cover border border-[#2a2a2a]" />}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="flex items-center gap-2 justify-center bg-[#0d0d0d] border border-dashed border-[#2a2a2a] rounded-xl h-12 hover:border-[#c9a84c] transition-all text-gray-400 hover:text-[#c9a84c]">
                                            <Upload className="h-4 w-4" />
                                            <span className="text-xs font-bold">{uploading ? 'Uploading...' : 'Upload New Image'}</span>
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-[#0d0d0d] p-4 rounded-2xl border border-[#2a2a2a] mt-4">
                                <input type="checkbox" id="editVeg" checked={editingItem.isVeg} onChange={(e) => setEditingItem({...editingItem, isVeg: e.target.checked})} className="h-5 w-5 accent-[#c9a84c] bg-[#111111]" />
                                <Label htmlFor="editVeg" className="font-bold text-gray-300">Vegetarian Friendly?</Label>
                            </div>
                        </div>
                    )}
                    <Button onClick={handleEditItem} className="w-full bg-[#c9a84c] text-black hover:bg-[#b8943d] h-14 rounded-2xl font-black text-lg mt-8 shadow-xl shadow-[#c9a84c]/10">UPDATE ENTRY</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RestaurantDashboard;
