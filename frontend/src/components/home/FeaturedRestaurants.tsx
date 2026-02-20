import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, MapPin, Leaf, Zap, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

const offerColors = [
  "#fc8019", "#e23744", "#c9a84c", "#10b981", "#8b5cf6",
];

const FeaturedRestaurants = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const filters = [
    { id: "all", label: "All" },
    { id: "top", label: "Top Rated" },
    { id: "fast", label: "Fast Delivery" },
    { id: "offer", label: "Offers" },
    { id: "veg", label: "Pure Veg" },
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await api.get("/restaurants");
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((r) => {
    if (activeFilter === "top") return parseFloat(r.rating) >= 4.3;
    if (activeFilter === "fast") return parseInt(r.deliveryTime) <= 30;
    if (activeFilter === "offer") return r.offer;
    if (activeFilter === "veg") return r.isVeg;
    return true;
  });

  return (
    <section className="bg-[#111111] py-14">
      <div className="container">
        {/* Section header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-8 rounded-full bg-[#fc8019]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#fc8019]">Restaurants</span>
            </div>
            <h2 className="font-black text-3xl text-white">
              Top Restaurants <span className="text-[#fc8019]">Near You</span>
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Handpicked restaurants with great food & fast delivery
            </p>
          </div>
          <Link
            to="/restaurants"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#fc8019] hover:text-[#e07010] transition-colors"
          >
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Filter chips (Zomato style) */}
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#333] text-gray-400 text-sm hover:border-[#c9a84c]/40 hover:text-white transition-all">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === f.id
                  ? "bg-[#c9a84c] text-black font-bold"
                  : "border border-[#333] text-gray-400 hover:border-[#c9a84c]/40 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#1a1a1a] overflow-hidden animate-pulse">
                <div className="h-48 bg-[#2a2a2a]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 bg-[#2a2a2a] rounded" />
                  <div className="h-3 w-1/2 bg-[#2a2a2a] rounded" />
                  <div className="h-3 w-2/3 bg-[#2a2a2a] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <span className="text-5xl block mb-4">🍽️</span>
            No restaurants match this filter.{" "}
            <button className="text-[#c9a84c] underline" onClick={() => setActiveFilter("all")}>
              Clear filter
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRestaurants.map((restaurant, idx) => (
              <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#c9a84c]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40">
                  {/* Restaurant Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]">
                    {restaurant.image ? (
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-6xl opacity-30">🍽️</span>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Offer Badge (Swiggy-style) */}
                    {restaurant.offer && (
                      <div
                        className="absolute bottom-3 left-3 flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-lg"
                        style={{ background: offerColors[idx % offerColors.length] }}
                      >
                        <Zap className="h-3 w-3" />
                        {restaurant.offer}
                      </div>
                    )}

                    {/* Veg badge */}
                    {restaurant.isVeg && (
                      <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#0d0d0d]/80 border border-green-500/50">
                        <Leaf className="h-3.5 w-3.5 text-green-500" />
                      </div>
                    )}

                    {/* Rating pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#0d0d0d]/90 rounded-full px-2.5 py-1 shadow-lg">
                      <Star className="h-3 w-3 fill-[#c9a84c] text-[#c9a84c]" />
                      <span className="text-xs font-bold text-white">{restaurant.rating || "4.2"}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-white truncate text-[15px] group-hover:text-[#c9a84c] transition-colors">
                          {restaurant.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-gray-500 truncate">{restaurant.cuisine || "Multi Cuisine"}</p>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="mt-3 pt-3 border-t border-[#2a2a2a] flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#fc8019]" />
                        {restaurant.deliveryTime || "30-40 mins"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#c9a84c]" />
                        {restaurant.location || "Coimbatore"}
                      </span>
                      <span className="font-medium text-gray-400">₹{restaurant.priceForTwo || "300"} for 2</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#fc8019] hover:text-[#e07010]"
          >
            View All Restaurants <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
