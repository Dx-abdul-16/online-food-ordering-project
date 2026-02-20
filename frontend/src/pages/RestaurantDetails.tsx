import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft, Star, Clock, MapPin, Plus, Flame,
  Check, Leaf, ShoppingBag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState, useEffect, Suspense, lazy } from "react";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";

// ── Lazy-load MapView to prevent Leaflet crash from killing the whole page ──
const MapView = lazy(() => import("@/components/MapView"));

// ── Simple error boundary for the map ────────────────────────────────────────
import React from "react";
class MapErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-40 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#111111] text-gray-500 text-sm gap-2">
          <MapPin className="h-4 w-4 text-[#c9a84c]" />
          Map could not be loaded
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
const MenuSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex gap-4 rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4 animate-pulse">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#2a2a2a] rounded w-3/4" />
          <div className="h-3 bg-[#2a2a2a] rounded w-1/4" />
          <div className="h-3 bg-[#2a2a2a] rounded w-full mt-2" />
          <div className="h-8 bg-[#2a2a2a] rounded-full w-24 mt-3" />
        </div>
        <div className="h-24 w-24 shrink-0 rounded-xl bg-[#2a2a2a]" />
      </div>
    ))}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    api.get(`/restaurants/${id}`)
      .then((data) => {
        if (data && data.id) {
          setRestaurant(data);
        } else {
          setError("Restaurant not found");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch restaurant:", err);
        setError("Could not load restaurant. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      restaurantId: restaurant.id,
    });
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    toast.success(`${item.name} added! 🛒`, {
      style: { background: "#141414", color: "#fff", border: "1px solid #2a2a2a" },
    });
    setTimeout(() => setAddedItems((prev) => ({ ...prev, [item.id]: false })), 1500);
  };

  // ── Categories ────────────────────────────────────────────────────────────
  const menuItems: any[] = restaurant?.menu || [];
  const categories = ["All", ...Array.from(new Set(menuItems.map((i: any) => i.category || "Main")))];
  const filteredMenu = activeCategory === "All"
    ? menuItems
    : menuItems.filter((i: any) => (i.category || "Main") === activeCategory);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d]">
        <Header />
        <div className="h-[260px] w-full bg-[#111111] animate-pulse" />
        <div className="container mt-8">
          <MenuSkeleton />
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-[#0d0d0d]">
        <Header />
        <div className="flex flex-col items-center justify-center gap-5 py-32">
          <span className="text-7xl opacity-30">🍽️</span>
          <h2 className="text-2xl font-black text-white">Restaurant not found</h2>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            onClick={() => navigate("/restaurants")}
            className="rounded-full bg-[#c9a84c] hover:bg-[#b8943d] text-black font-bold px-8 py-3 transition-all"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24">
      <Header />

      {/* ── Hero Banner ── */}
      <div className="relative h-[240px] w-full md:h-[360px] overflow-hidden">
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1a1505] via-[#2a1f08] to-[#0d0d0d] flex items-center justify-center">
            <span className="text-[100px] opacity-10">🍽️</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/50 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur px-3 py-2 text-sm text-white hover:bg-black/80 transition-all border border-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Restaurant info overlay */}
        <div className="absolute bottom-0 left-0 right-0 container pb-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-black text-white md:text-4xl leading-tight">
                {restaurant.name}
              </h1>
              <p className="text-[#c9a84c] font-semibold mt-1 text-sm">{restaurant.cuisine || "Multi Cuisine"}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 bg-black/60 backdrop-blur rounded-full px-3 py-1.5 border border-white/10">
                  <Star className="h-3 w-3 fill-[#c9a84c] text-[#c9a84c]" />
                  <span className="font-bold text-white">{restaurant.rating || "4.2"}</span>
                </span>
                <span className="flex items-center gap-1 bg-black/60 backdrop-blur rounded-full px-3 py-1.5 border border-white/10 text-gray-300">
                  <Clock className="h-3 w-3 text-[#fc8019]" />
                  {restaurant.deliveryTime || "30-40 min"}
                </span>
                <span className="flex items-center gap-1 bg-black/60 backdrop-blur rounded-full px-3 py-1.5 border border-white/10 text-gray-300">
                  <MapPin className="h-3 w-3 text-[#c9a84c]" />
                  {restaurant.location || "Coimbatore"}
                </span>
                {restaurant.isVeg && (
                  <span className="flex items-center gap-1 bg-green-500/20 border border-green-500/40 rounded-full px-3 py-1.5 text-green-400">
                    <Leaf className="h-3 w-3" /> Pure Veg
                  </span>
                )}
              </div>
            </div>
            {restaurant.offer && (
              <Badge className="w-fit bg-gradient-to-r from-[#fc8019] to-[#e23744] text-white text-sm px-4 py-1.5 font-bold border-0 rounded-full">
                🔥 {restaurant.offer}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mt-6 space-y-8">
        {/* ── Map (isolated — crash won't kill the page) ── */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-1 w-6 rounded-full bg-[#c9a84c]" />
            <h2 className="text-base font-bold text-white">Location</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#2a2a2a]">
            <MapErrorBoundary>
              <Suspense fallback={
                <div className="h-40 bg-[#111111] flex items-center justify-center text-gray-600 text-sm">
                  Loading map…
                </div>
              }>
                <MapView
                  center={
                    restaurant.latitude && restaurant.longitude
                      ? [restaurant.latitude, restaurant.longitude]
                      : [11.0168, 76.9558]
                  }
                  zoom={15}
                  popupText={restaurant.name}
                  height="220px"
                />
              </Suspense>
            </MapErrorBoundary>
          </div>
        </div>

        {/* ── Menu section ── */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-1 w-6 rounded-full bg-[#e23744]" />
              <h2 className="text-lg font-black text-white">Menu</h2>
              <Flame className="h-4 w-4 text-[#e23744]" />
              <span className="text-sm text-gray-500">{menuItems.length} items</span>
            </div>
          </div>

          {/* Category chips */}
          {categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]"
                      : "border-[#2a2a2a] text-gray-500 hover:border-[#c9a84c]/30 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Menu grid */}
          {filteredMenu.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenu.map((item: any) => (
                <div
                  key={item.id}
                  className="group flex gap-3 rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4 hover:border-[#c9a84c]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50"
                >
                  {/* Text side */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    {/* Veg/non-veg dot */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className={`h-3 w-3 rounded border-[1.5px] flex items-center justify-center ${
                        item.isVeg ? "border-green-500" : "border-red-500"
                      }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${item.isVeg ? "text-green-500" : "text-red-400"}`}>
                        {item.isVeg ? "Veg" : "Non-Veg"}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm leading-snug group-hover:text-[#c9a84c] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm font-black text-[#c9a84c] mt-1">₹{item.price}</p>
                    {item.description && (
                      <p className="mt-1.5 line-clamp-2 text-xs text-gray-500 leading-relaxed flex-1">
                        {item.description}
                      </p>
                    )}

                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`mt-3 self-start flex items-center gap-1 h-8 rounded-full px-4 font-bold text-xs transition-all ${
                        addedItems[item.id]
                          ? "bg-green-500 hover:bg-green-600 text-white scale-95"
                          : "bg-[#c9a84c] hover:bg-[#b8943d] text-black hover:scale-105"
                      }`}
                    >
                      {addedItems[item.id] ? (
                        <><Check className="h-3 w-3" /> Added</>
                      ) : (
                        <><Plus className="h-3 w-3" /> Add</>
                      )}
                    </button>
                  </div>

                  {/* Image */}
                  <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-[#1f1f1f]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-3xl">🍽️</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#2a2a2a] bg-[#141414] py-16 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-700" />
              <p className="text-gray-500 font-medium">No menu items yet.</p>
              <p className="text-xs text-gray-600">Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
