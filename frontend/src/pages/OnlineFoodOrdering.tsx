import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star, Clock, MapPin, ChevronRight, X, Percent, Navigation, ShoppingBag } from "lucide-react";
import { api } from "@/lib/api";

const CATEGORIES = [
  { name: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&h=150&fit=crop" },
  { name: "Pizzas", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop" },
  { name: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop" },
  { name: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=150&h=150&fit=crop" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=150&h=150&fit=crop" },
  { name: "South Indian", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=150&h=150&fit=crop" },
];

export default function OnlineFoodOrdering() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await api.get("/restaurants");
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter(r => 
    r.name?.toLowerCase().includes(search.toLowerCase()) || 
    r.cuisine?.toLowerCase().includes(search.toLowerCase())
  );

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  })();

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch(user.role) {
      case "admin": return "/admin/dashboard";
      case "hotel": return "/restaurant/dashboard";
      case "delivery": return "/delivery/dashboard";
      default: return "/user/dashboard";
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#222831] text-[#EEEEEE]">
      {/* ── CUSTOM TEAL MIX HEADER ── */}
      <header className="sticky top-0 z-50 bg-[#222831] border-b border-[#393E46] shadow-sm py-4">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-4">
          <Link className="flex gap-2 items-center" to="/">
             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00ADB5] text-[#222831] shadow-xl shadow-[#00ADB5]/30 transform -rotate-6">
                <ShoppingBag className="h-6 w-6 stroke-[2.5]" />
             </div>
             <div>
                <h1 className="font-extrabold text-[#EEEEEE] text-2xl tracking-tighter leading-none">
                    teal<span className="text-[#00ADB5]">giggy.</span>
                </h1>
             </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-2 text-sm bg-[#393E46] border border-[#393E46] px-4 py-2.5 rounded-full hover:bg-[#393E46]/80 transition-colors shadow-sm cursor-pointer group">
            <MapPin className="h-4 w-4 text-[#00ADB5] group-hover:animate-bounce" />
            <span className="font-bold text-[#EEEEEE]">
                Coimbatore, Tamil Nadu
            </span>
            <ChevronRight className="h-4 w-4 text-[#EEEEEE] group-hover:text-[#00ADB5]" />
          </div>

          <div className="flex items-center gap-6">
             {user ? (
                <>
                  <Link to={getDashboardLink()} className="hidden sm:block font-bold text-[#EEEEEE] hover:text-[#00ADB5] transition-colors">{user.username || "Dashboard"}</Link>
                  <button onClick={() => { localStorage.removeItem("user"); window.location.reload(); }} className="hidden sm:block font-bold text-red-400 hover:text-red-300 transition-colors">Logout</button>
                </>
             ) : (
                <>
                  <Link to="/login" className="hidden sm:block font-bold text-[#EEEEEE] hover:text-[#00ADB5] transition-colors">Log In</Link>
                  <Link to="/register" className="hidden sm:block font-bold text-[#EEEEEE] hover:text-[#00ADB5] transition-colors">Sign Up</Link>
                </>
             )}
             <button className="flex items-center gap-2 bg-[#00ADB5] hover:bg-[#008a91] text-[#222831] px-6 py-3 rounded-xl font-extrabold transition-all shadow-lg shadow-[#00ADB5]/30 hover:scale-105 active:scale-95">
                 <span className="hidden sm:inline">Track Orders</span>
                 <Navigation className="h-4 w-4" />
             </button>
          </div>
        </div>
      </header>

      {/* ── HERO SEARCH AREA ── */}
      <section className="bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center py-20 px-4 relative border-b border-[#393E46]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#222831]/80 via-[#222831]/90 to-[#222831]"></div>
        <div className="container max-w-4xl mx-auto text-center space-y-6 relative z-10 pt-10">
            <h2 className="text-4xl md:text-6xl font-black text-[#EEEEEE] tracking-tight drop-shadow-lg">
                Taste the galaxy
            </h2>
            <p className="text-[#EEEEEE] font-medium text-xl md:text-2xl drop-shadow-md pb-6 opacity-80">Coimbatore's premium delivery network.</p>
            
            <div className="relative max-w-3xl mx-auto mt-8 group flex shadow-2xl rounded-2xl overflow-hidden bg-[#393E46] border-2 border-transparent focus-within:border-[#00ADB5] transition-all">
                <div className="flex items-center justify-center px-4 bg-[#222831] border-r border-[#393E46]">
                    <MapPin className="h-5 w-5 text-[#00ADB5]" />
                    <span className="ml-2 font-bold text-[#EEEEEE] truncate max-w-[100px] hidden sm:inline-block">Coimbatore</span>
                </div>
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-[#EEEEEE] opacity-50 group-focus-within:text-[#00ADB5] group-focus-within:opacity-100 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for restaurant, cuisine or a dish..."
                        className="block w-full pl-12 pr-12 py-5 text-lg font-medium outline-none bg-[#393E46] text-[#EEEEEE] placeholder:font-normal placeholder:text-[#EEEEEE]/50"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#EEEEEE]/50 hover:text-[#00ADB5] transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* ── INSPIRATION BUBBLES ── */}
      <section className="py-12 px-4 bg-[#222831] relative -mt-6 rounded-t-3xl z-20">
        <div className="container max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black text-[#EEEEEE] tracking-tight">Inspiration for your first order</h3>
            </div>
            <div className="flex gap-8 overflow-x-auto pb-8 pt-2 scrollbar-hide snap-x">
                {CATEGORIES.map((cat, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-4 shrink-0 snap-center cursor-pointer group" onClick={() => setSearch(cat.name)}>
                        <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-lg shadow-[#00ADB5]/10 group-hover:shadow-2xl transition-all group-hover:-translate-y-2 border-2 border-[#393E46] group-hover:border-[#00ADB5]">
                            <img src={cat.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={cat.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#222831]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-lg font-bold text-[#EEEEEE] group-hover:text-[#00ADB5] transition-colors">{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* ── RESTAURANT GRID ── */}
      <section className="py-12 bg-[#393E46] px-4 min-h-[500px]">
        <div className="container max-w-7xl mx-auto">
            <h3 className="text-3xl font-black text-[#EEEEEE] mb-10 tracking-tight">
                Delivery Restaurants in Coimbatore
            </h3>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#222831] border-t-[#00ADB5]"></div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-[#222831] rounded-3xl border border-[#393E46] shadow-sm max-w-2xl mx-auto">
                    <div className="w-24 h-24 bg-[#393E46] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-10 w-10 text-[#00ADB5]" />
                    </div>
                    <p className="text-2xl font-bold text-[#EEEEEE] mb-2">No active restaurants found</p>
                    <p className="text-[#EEEEEE]/70">We couldn't find any match for "{search}".</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {filtered.map((restaurant) => (
                        <div 
                            key={restaurant.id} 
                            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                            className="group cursor-pointer rounded-2xl bg-[#222831] transition-all duration-300 overflow-hidden flex flex-col hover:shadow-[0_10px_40px_-10px_rgba(0,173,181,0.2)] hover:-translate-y-1 border border-[#393E46] hover:border-[#00ADB5]/50"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
                                {restaurant.image ? (
                                    <img 
                                        src={restaurant.image} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out bg-[#393E46]" 
                                        alt={restaurant.name} 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#393E46] flex items-center justify-center text-4xl">🍽️</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#222831]/90 via-[#222831]/10 to-transparent opacity-90" />
                                
                                {/* Offer Badge */}
                                {(restaurant.offer || (restaurant.price_for_two > 400)) && (
                                    <div className="absolute top-4 -left-1 bg-[#00ADB5] text-[#222831] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-r-md flex items-center shadow-lg transform -skew-x-6">
                                        <span className="skew-x-6">
                                            {restaurant.offer || "PRO 20% OFF"}
                                        </span>
                                    </div>
                                )}
                                
                                {/* Info overlay at bottom of image */}
                                <div className="absolute bottom-3 left-4 right-4">
                                    <div className="flex justify-between items-end">
                                        <h4 className="font-extrabold text-[22px] text-[#EEEEEE] drop-shadow-md truncate pr-2 leading-tight tracking-tight">
                                            {restaurant.name}
                                        </h4>
                                        <div className="flex items-center gap-1 bg-[#00ADB5] text-[#222831] text-xs font-bold px-1.5 py-0.5 rounded-lg shadow-md shrink-0">
                                            <span>{restaurant.rating || "4.2"}</span>
                                            <Star className="h-3 w-3 fill-[#222831] text-[#222831]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Container */}
                            <div className="pt-4 px-3 pb-3 flex flex-col flex-1 bg-[#222831]">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[#EEEEEE]/80 text-[15px] truncate max-w-[70%]">
                                        {restaurant.cuisine || "Multi-Cuisine"}
                                    </p>
                                    <p className="text-[#EEEEEE]/90 font-medium text-sm">
                                        ₹{restaurant.price_for_two || 300} for one
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-3 text-sm font-semibold text-[#EEEEEE] mb-4 mt-auto">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-[#393E46] flex items-center justify-center">
                                            <Clock className="w-3.5 h-3.5 text-[#00ADB5]" />
                                        </div>
                                        <span>{restaurant.deliveryTime || restaurant.delivery_time || "45 min"}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#393E46] flex items-center justify-between group-hover:border-[#00ADB5]/50 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-[#393E46] rounded-full flex items-center justify-center">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#00ADB5]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <p className="text-xs text-[#EEEEEE]/80 font-medium">Free delivery above ₹199</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-[#EEEEEE]/40 group-hover:text-[#00ADB5] transition-colors -translate-x-2 group-hover:translate-x-0" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </section>
      
      {/* ── FOOTER OVERRIDE ── */}
      <footer className="bg-[#222831] border-t border-[#393E46] text-[#EEEEEE] py-16 px-4">
         <div className="container max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00ADB5] transform -rotate-6">
                    <ShoppingBag className="h-6 w-6 stroke-[2.5] text-[#222831]" />
                </div>
                <div>
                   <h1 className="font-extrabold text-2xl tracking-tighter text-[#EEEEEE] leading-none">
                       teal<span className="text-[#00ADB5]">giggy.</span>
                   </h1>
                   <p className="font-semibold text-xs tracking-widest text-[#EEEEEE]/60 mt-1">BEST OF BOTH WORLDS</p>
                </div>
            </div>
            <div className="text-center md:text-right">
                <p className="text-sm font-semibold text-[#EEEEEE]/80 tracking-wider mb-2">© 2026 TEALGIGGY DELIVERY PARTNERS.</p>
                <p className="text-xs text-[#EEEEEE]/50">Lovingly created for the ultimate dark space experience.</p>
            </div>
         </div>
      </footer>
    </div>
  );
}
