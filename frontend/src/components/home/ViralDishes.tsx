/**
 * ViralDishes – Street Arabiya style "Our Viral Dishes" section
 * Full dark, gold-accented, cinematic food showcase
 */
import { Link } from "react-router-dom";
import { useState } from "react";
import { Flame, ChevronRight } from "lucide-react";

const dishes = [
  { name: "Afghani Alfaham", emoji: "🔥", desc: "Whole roasted chicken marinated in Afghani spices, charcoal grilled to perfection.", tag: "Best Seller", price: "₹399" },
  { name: "Chicken Mandi", emoji: "🍗", desc: "Slow-cooked tender chicken on aromatic saffron rice with traditional Yemeni spices.", tag: "Viral", price: "₹349" },
  { name: "Mutton Raan", emoji: "🦴", desc: "50-hour marinated whole leg of mutton slow roasted in a Tandoor. A royal feast.", tag: "Chef's Choice", price: "₹899" },
  { name: "Mexican Shawarma", emoji: "🌯", desc: "A fusion blast — juicy chicken with salsa, guacamole, jalapeños, and garlic sauce.", tag: "New", price: "₹199" },
  { name: "Malai Kebab", emoji: "🍢", desc: "Melt-in-your-mouth cream-marinated chicken skewers grilled over live charcoal.", tag: "Fan Fav", price: "₹279" },
  { name: "Mutton Ribs", emoji: "🥩", desc: "BBQ-glazed tender mutton ribs with a smoky Arabic spice crust.", tag: "Weekend Special", price: "₹699" },
];

const tagColors: Record<string, string> = {
  "Best Seller": "#fc8019",
  "Viral": "#e23744",
  "Chef's Choice": "#c9a84c",
  "New": "#10b981",
  "Fan Fav": "#a855f7",
  "Weekend Special": "#06b6d4",
};

const ViralDishes = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-[#0a0a0a] py-16 relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <Flame className="h-5 w-5 text-[#c9a84c]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">Trending Now</span>
            <Flame className="h-5 w-5 text-[#c9a84c]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
          <h2 className="font-black text-4xl text-white">
            Our <span className="text-[#c9a84c]">Viral</span> Dishes
          </h2>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            Dishes so good, they break the internet. Order the ones everyone's talking about.
          </p>
        </div>

        {/* Dishes Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish, idx) => (
            <Link
              key={dish.name}
              to="/restaurants"
              className="group relative flex items-center gap-4 rounded-2xl border border-[#2a2a2a] bg-[#141414] p-5 transition-all duration-300 hover:border-[#c9a84c]/40 hover:bg-[#1a1a1a] hover:shadow-xl hover:shadow-[#c9a84c]/5 hover:-translate-y-0.5"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Emoji bubble */}
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl transition-all duration-300"
                style={{
                  background: hovered === idx ? `${tagColors[dish.tag]}22` : "#1f1f1f",
                  border: `1px solid ${hovered === idx ? tagColors[dish.tag] + "50" : "#2f2f2f"}`,
                  transform: hovered === idx ? "scale(1.1) rotate(-3deg)" : "scale(1)",
                }}
              >
                {dish.emoji}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-white text-sm leading-tight">{dish.name}</h3>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0"
                    style={{
                      background: `${tagColors[dish.tag]}20`,
                      color: tagColors[dish.tag],
                      border: `1px solid ${tagColors[dish.tag]}40`,
                    }}
                  >
                    {dish.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{dish.desc}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-sm" style={{ color: tagColors[dish.tag] }}>
                    {dish.price}
                  </span>
                  <span className="text-xs text-[#c9a84c] opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    Order <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link to="/restaurants">
            <button className="group inline-flex items-center gap-3 rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-8 py-3.5 text-sm font-bold text-[#c9a84c] transition-all hover:bg-[#c9a84c] hover:text-black hover:border-[#c9a84c]">
              <Flame className="h-4 w-4" />
              Explore Full Menu
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ViralDishes;
