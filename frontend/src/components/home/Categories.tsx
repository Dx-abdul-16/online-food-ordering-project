import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { name: "Shawarma", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=200&h=200&fit=crop", bg: "from-amber-900/40 to-amber-800/20", color: "#c9a84c" },
  { name: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop", bg: "from-orange-900/40 to-orange-800/20", color: "#fc8019" },
  { name: "Mandi", image: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=200&h=200&fit=crop", bg: "from-red-900/40 to-red-800/20", color: "#e23744" },
  { name: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop", bg: "from-yellow-900/40 to-yellow-800/20", color: "#f59e0b" },
  { name: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop", bg: "from-orange-900/40 to-red-900/20", color: "#ea580c" },
  { name: "Kebabs", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200&h=200&fit=crop", bg: "from-rose-900/40 to-rose-800/20", color: "#f43f5e" },
  { name: "Alfaham", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200&h=200&fit=crop", bg: "from-red-950/40 to-orange-900/20", color: "#ef4444" },
  { name: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop", bg: "from-red-900/40 to-pink-900/20", color: "#ec4899" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop", bg: "from-pink-900/40 to-purple-900/20", color: "#a855f7" },
  { name: "Beverages", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop", bg: "from-blue-900/40 to-cyan-900/20", color: "#06b6d4" },
  { name: "North Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop", bg: "from-orange-900/40 to-amber-900/20", color: "#f97316" },
  { name: "South Indian", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&h=200&fit=crop", bg: "from-green-900/40 to-emerald-900/20", color: "#10b981" },
];

const Categories = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 240 : -240, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#0d0d0d] py-14">
      <div className="container">
        {/* Section header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-8 rounded-full bg-[#c9a84c]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">Cuisines</span>
            </div>
            <h2 className="font-black text-3xl text-white">
              What's on your <span className="text-[#c9a84c]">mind?</span>
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">Browse through popular cuisines & dishes</p>
          </div>

          {/* Scroll controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] text-gray-400 hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] text-gray-400 hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scrollable (Zomato-style circles) */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-none pb-2"
        >
          {categories.map((cat, idx) => (
            <Link
              key={cat.name}
              to={`/restaurants?category=${encodeURIComponent(cat.name.toLowerCase())}`}
              className="group flex flex-col items-center gap-3 shrink-0"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Circle image */}
              <div
                className={`relative flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 transition-all duration-300 overflow-hidden`}
                style={{
                  borderColor: hoveredIdx === idx ? cat.color : "#2a2a2a",
                  boxShadow: hoveredIdx === idx ? `0 0 20px ${cat.color}40` : "none",
                  transform: hoveredIdx === idx ? "translateY(-4px) scale(1.05)" : "none",
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover rounded-full"
                  loading="lazy"
                />


                {/* Shimmer on hover */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${cat.color}25, transparent 70%)`,
                  }}
                />
              </div>

              <span
                className="text-xs font-semibold text-center transition-colors"
                style={{ color: hoveredIdx === idx ? cat.color : "#9ca3af" }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default Categories;
