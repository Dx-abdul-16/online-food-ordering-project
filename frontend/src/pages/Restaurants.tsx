import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Clock, MapPin, SlidersHorizontal, X, Leaf, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// ── Filter/sort options ──────────────────────────────────────────────────────
const CUISINE_FILTERS = ["All", "Arabic", "Biryani", "Shawarma", "Mandi", "Kebabs", "Pizza", "Burgers", "South Indian"];
const SORT_OPTIONS = [
  { label: "Relevance",       value: "relevance" },
  { label: "Rating (High)",   value: "rating" },
  { label: "Delivery Time",   value: "time" },
  { label: "Price (Low)",     value: "price_asc" },
  { label: "Price (High)",    value: "price_desc" },
];

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] overflow-hidden animate-pulse">
    <div className="h-44 bg-[#1a1a1a]" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-[#2a2a2a] rounded w-3/4" />
      <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
      <div className="flex gap-2 mt-2">
        <div className="h-3 bg-[#2a2a2a] rounded w-12" />
        <div className="h-3 bg-[#2a2a2a] rounded w-16" />
      </div>
    </div>
  </div>
);

// ── Restaurant card ───────────────────────────────────────────────────────────
const RestaurantCard = ({ restaurant }: { restaurant: any }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="group block">
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] overflow-hidden hover:border-[#c9a84c]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60">
        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#1a1505] to-[#2a2a2a]">
          {restaurant.image ? (
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-6xl opacity-30">🍽️</div>
          )}
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />



          {/* Veg badge */}
          {restaurant.isVeg && (
            <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded bg-white/90">
              <Leaf className="h-3.5 w-3.5 text-green-600" />
            </div>
          )}

          {/* Rating */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/80 backdrop-blur rounded-full px-2.5 py-1">
            <Star className="h-3 w-3 fill-[#c9a84c] text-[#c9a84c]" />
            <span className="text-xs font-bold text-white">{restaurant.rating || "4.2"}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-black text-[15px] text-white group-hover:text-[#c9a84c] transition-colors truncate">
            {restaurant.name}
          </h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">{restaurant.cuisine || "Multi Cuisine"}</p>

          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#fc8019]" />
              {restaurant.deliveryTime || restaurant.delivery_time || "30-40 min"}
            </span>
            <span className="text-[#2a2a2a]">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[#c9a84c]" />
              {restaurant.location || "Saravanampatti, Coimbatore"}
            </span>
            {restaurant.minOrder && (
              <>
                <span className="text-[#2a2a2a]">•</span>
                <span>₹{restaurant.minOrder} min</span>
              </>
            )}
          </div>

          {/* Bottom tag strip */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(restaurant.tags || ["Popular"]).slice(0, 3).map((tag: string) => (
              <span key={tag} className="rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 text-[10px] text-gray-500">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [showSort, setShowSort] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await api.get("/restaurants");
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch restaurants error:", err);
        setError(`Could not load restaurants: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // ── Filter + Sort ────────────────────────────────────────────────────────
  const applyFilters = useCallback(() => {
    let list = [...restaurants];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.cuisine?.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q)
      );
    }

    if (activeCuisine !== "All") {
      list = list.filter((r) =>
        r.cuisine?.toLowerCase().includes(activeCuisine.toLowerCase())
      );
    }

    switch (sortBy) {
      case "rating":
        list.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
        break;
      case "time":
        list.sort((a, b) => {
          const ta = parseInt(a.deliveryTime || a.delivery_time || "40");
          const tb = parseInt(b.deliveryTime || b.delivery_time || "40");
          return ta - tb;
        });
        break;
      case "price_asc":
        list.sort((a, b) => (a.minOrder || 0) - (b.minOrder || 0));
        break;
      case "price_desc":
        list.sort((a, b) => (b.minOrder || 0) - (a.minOrder || 0));
        break;
    }

    setFiltered(list);
  }, [restaurants, search, activeCuisine, sortBy]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const clearSearch = () => setSearch("");

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Header />

      {/* ── Page Hero ── */}
      <div className="bg-[#0d0d0d] border-b border-[#1e1e1e] py-10">
        <div className="container">
          <div className="mb-1 flex items-center gap-3">
            <div className="h-px w-6 bg-[#c9a84c]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">Saravanampatti, Coimbatore</span>
          </div>
          <h1 className="font-black text-3xl text-white md:text-4xl">
            All <span className="text-[#c9a84c]">Restaurants</span>
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            {loading ? "Loading..." : `${filtered.length} restaurant${filtered.length !== 1 ? "s" : ""} found`}
          </p>

          {/* Search bar */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, cuisine, location…"
              className="w-full h-12 rounded-full border border-[#2a2a2a] bg-[#141414] pl-11 pr-10 text-sm text-white placeholder:text-gray-600 focus:border-[#c9a84c]/50 focus:outline-none transition-colors"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* ── Filters row ── */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          {/* Cuisine chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CUISINE_FILTERS.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCuisine(c)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
                  activeCuisine === c
                    ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]"
                    : "border-[#2a2a2a] text-gray-500 hover:border-[#c9a84c]/30 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#141414] px-4 py-2 text-xs font-bold text-gray-400 hover:border-[#c9a84c]/30 hover:text-white transition-all"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
              <ChevronDown className={`h-3 w-3 transition-transform ${showSort ? "rotate-180" : ""}`} />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-2 z-50 w-44 rounded-xl border border-[#2a2a2a] bg-[#141414] shadow-xl overflow-hidden">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                    className={`w-full px-4 py-2.5 text-left text-xs font-semibold transition-colors hover:bg-[#1f1f1f] ${
                      sortBy === opt.value ? "text-[#c9a84c]" : "text-gray-400"
                    }`}
                  >
                    {sortBy === opt.value && "✓ "}{opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            ⚠️ {error}
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-20">
            <span className="text-6xl opacity-30">🍽️</span>
            <p className="text-lg font-bold text-white">No restaurants found</p>
            <p className="text-sm text-gray-500">
              {search ? `No results for "${search}"` : `No restaurants match the selected cuisine`}
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCuisine("All"); }}
              className="mt-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 px-6 py-2 text-sm font-bold text-[#c9a84c] hover:bg-[#c9a84c]/20 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Restaurants;
