import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { name: "Shawarma", emoji: "🥙", bg: "from-amber-900/40 to-amber-800/20", color: "#c9a84c" },
  { name: "Biryani", emoji: "🍚", bg: "from-orange-900/40 to-orange-800/20", color: "#fc8019" },
  { name: "Mandi", emoji: "🍗", bg: "from-red-900/40 to-red-800/20", color: "#e23744" },
  { name: "Pizza", emoji: "🍕", bg: "from-yellow-900/40 to-yellow-800/20", color: "#f59e0b" },
  { name: "Burgers", emoji: "🍔", bg: "from-orange-900/40 to-red-900/20", color: "#ea580c" },
  { name: "Kebabs", emoji: "🍢", bg: "from-rose-900/40 to-rose-800/20", color: "#f43f5e" },
  { name: "Alfaham", emoji: "🔥", bg: "from-red-950/40 to-orange-900/20", color: "#ef4444" },
  { name: "Chinese", emoji: "🥡", bg: "from-red-900/40 to-pink-900/20", color: "#ec4899" },
  { name: "Desserts", emoji: "🍰", bg: "from-pink-900/40 to-purple-900/20", color: "#a855f7" },
  { name: "Beverages", emoji: "🥤", bg: "from-blue-900/40 to-cyan-900/20", color: "#06b6d4" },
  { name: "North Indian", emoji: "🍛", bg: "from-orange-900/40 to-amber-900/20", color: "#f97316" },
  { name: "South Indian", emoji: "🍜", bg: "from-green-900/40 to-emerald-900/20", color: "#10b981" },
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
              {/* Circle image (Zomato style) */}
              <div
                className={`relative flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gradient-to-br ${cat.bg} border-2 transition-all duration-300 overflow-hidden`}
                style={{
                  borderColor: hoveredIdx === idx ? cat.color : "#2a2a2a",
                  boxShadow: hoveredIdx === idx ? `0 0 20px ${cat.color}40` : "none",
                  transform: hoveredIdx === idx ? "translateY(-4px) scale(1.05)" : "none",
                }}
              >
                <span className="text-4xl select-none">{cat.emoji}</span>

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
