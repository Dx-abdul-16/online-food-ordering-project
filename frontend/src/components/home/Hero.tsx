import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ChevronRight, Utensils, ShoppingBag, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const slides = [
  {
    badge: "Vibrant & Relaxing",
    title: "Inviting to",
    subtitle: "Arabian Atmosphere",
    desc: "Experience the bold, authentic flavors of Arabic cuisine crafted with love and tradition.",
    cta: "Order Now",
    ctaLink: "/restaurants",
    bg: "from-[#0d0a04] via-[#1a1105] to-[#0d0a04]",
    accent: "#c9a84c",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&h=400&fit=crop",
    foodImages: [
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=150&h=150&fit=crop",
    ],
    tag: "🕌 Authentic Arabic",
  },
  {
    badge: "Ultimate Protein Fix",
    title: "Legendary",
    subtitle: "Chicken Mandi",
    desc: "Slow-cooked with aromatic spices in the traditional way — tender, juicy, unforgettable.",
    cta: "Explore Menu",
    ctaLink: "/restaurants",
    bg: "from-[#0d0004] via-[#1a0808] to-[#0d0004]",
    accent: "#e23744",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop",
    foodImages: [
      "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1544025162-8350b551d7a8?w=150&h=150&fit=crop",
    ],
    tag: "🔥 Best Seller",
  },
  {
    badge: "50+ Flavourful",
    title: "Irresistible",
    subtitle: "Shawarma Rolls",
    desc: "Wrapped with the freshest ingredients — juicy meat, garlic sauce, pickles and so much more.",
    cta: "Order Shawarma",
    ctaLink: "/restaurants",
    bg: "from-[#040a0d] via-[#081520] to-[#040a0d]",
    accent: "#fc8019",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=400&fit=crop",
    foodImages: [
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=150&h=150&fit=crop",
    ],
    tag: "⚡ 30 min delivery",
  },
];

const modes = [
  { id: "delivery", label: "Delivery", icon: ShoppingBag },
  { id: "dining", label: "Dining Out", icon: Utensils },
  { id: "catering", label: "Catering", icon: Star },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMode, setActiveMode] = useState("delivery");
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(idx);
        setAnimating(false);
      }, 300);
    },
    [animating]
  );

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      {/* ─── Atmospheric Banner (Street Arabiya Style) ─── */}
      <div
        className={`relative min-h-[580px] bg-gradient-to-br ${slide.bg} transition-all duration-700 flex items-center`}
      >
        {/* Decorative geometric Islamic pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated golden bokeh circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${40 + i * 20}px`,
                height: `${40 + i * 20}px`,
                background: `radial-gradient(circle, ${slide.accent}22 0%, transparent 70%)`,
                left: `${(i * 15) % 90}%`,
                top: `${(i * 23) % 80}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.7}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 grid lg:grid-cols-2 gap-8 items-center py-16">
          {/* Left: Text Content */}
          <div
            className={`transition-all duration-500 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 max-w-[40px]" style={{ background: slide.accent }} />
              <span className="text-sm font-light tracking-widest" style={{ color: slide.accent }}>
                {slide.badge}
              </span>
              <div className="h-px flex-1 max-w-[40px]" style={{ background: slide.accent }} />
            </div>

            <h1 className="font-black text-5xl sm:text-6xl text-white leading-tight">
              {slide.title}
            </h1>
            <h2 className="font-black text-5xl sm:text-6xl leading-tight mb-4" style={{ color: slide.accent }}>
              {slide.subtitle}
            </h2>

            <p className="text-gray-400 text-lg mb-8 max-w-md leading-relaxed">
              {slide.desc}
            </p>

            {/* Tag badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 border"
              style={{ color: slide.accent, borderColor: `${slide.accent}40`, background: `${slide.accent}15` }}
            >
              {slide.tag}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to={slide.ctaLink}>
                <Button
                  size="lg"
                  className="h-12 px-8 font-bold text-black rounded-full shadow-lg transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)` }}
                >
                  {slide.cta}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/restaurants">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 font-semibold rounded-full border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                >
                  View Menu
                </Button>
              </Link>
            </div>

            {/* Slide Dots */}
            <div className="flex items-center gap-2 mt-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "28px" : "8px",
                    height: "8px",
                    background: i === current ? slide.accent : "#4a4a4a",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: Food Visual Panel */}
          <div
            className={`hidden lg:flex items-center justify-center transition-all duration-500 ${animating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          >
            <div className="relative w-full max-w-[420px] aspect-square">
              {/* Central big image */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-full border-[3px] overflow-hidden z-20 transition-all duration-700 shadow-2xl"
                style={{
                  borderColor: `${slide.accent}50`,
                  boxShadow: `0 0 40px ${slide.accent}30`,
                }}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover animate-spin-veryslow"
                  loading="lazy"
                />
              </div>

              {/* Orbiting food images */}
              {slide.foodImages.map((imgUrl, i) => {
                return (
                  <div
                    key={i}
                    className="absolute flex h-[72px] w-[72px] items-center justify-center rounded-full overflow-hidden shadow-xl"
                    style={{
                      left: "50%",
                      top: "50%",
                      border: `2px solid ${slide.accent}60`,
                      animation: `spin-slow 20s linear infinite`,
                      animationDelay: `-${(i / slide.foodImages.length) * 20}s`,
                    }}
                  >
                    <img src={imgUrl} alt="dish" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Slide progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${((current + 1) / slides.length) * 100}%`, background: slide.accent }}
          />
        </div>
      </div>

      {/* ─── Delivery / Dining / Catering Tabs (Zomato Style) ─── */}
      <div className="bg-[#111111] border-b border-[#222] sticky top-16 z-40">
        <div className="container">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-3">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#c9a84c] text-black shadow-lg shadow-[#c9a84c]/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-black" : ""}`} />
                  {mode.label}
                  {isActive && (
                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-black/50 inline-block" />
                  )}
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-2 shrink-0">
              <div className="h-5 w-px bg-[#333]" />
              <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] hover:border-[#c9a84c]/40 rounded-full px-4 py-2 transition-all">
                <Search className="h-3.5 w-3.5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/restaurants?q=${searchQuery}`)}
                  placeholder="Search restaurant, dish..."
                  className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none w-48"
                />
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#333] text-gray-400 text-sm hover:border-[#c9a84c]/40 hover:text-white transition-all">
                <MapPin className="h-3.5 w-3.5 text-[#c9a84c]" />
                Saravanampatti, Coimbatore
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar (Street Arabiya style) */}
      <div className="bg-gradient-to-r from-[#c9a84c] via-[#d4b060] to-[#c9a84c] py-3">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-1">
            {[
              { num: "2.8k+", label: "Daily Orders" },
              { num: "500+", label: "Restaurants" },
              { num: "30 min", label: "Avg Delivery" },
              { num: "4.8★", label: "Avg Rating" },
              { num: "139+", label: "Menu Items" },
              { num: "25+", label: "Locations" },
            ].map((stat) => (
              <div key={stat.num} className="flex items-center gap-2 text-black">
                <span className="font-black text-sm">{stat.num}</span>
                <span className="text-xs font-medium opacity-70">{stat.label}</span>
                <span className="text-black/30 last:hidden">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg) translateX(190px) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg) translateX(190px) rotate(-360deg); }
        }
        @keyframes spin-veryslow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default Hero;
