/**
 * FounderStory – Street Arabiya-inspired founders/about section
 */
import { Quote, Award, Users, TrendingUp } from "lucide-react";

const stats = [
  { num: "2.8k+", label: "Daily Orders", icon: TrendingUp },
  { num: "10+", label: "Restaurants", icon: Award },
  { num: "25+", label: "Food Trucks", icon: Users },
  { num: "39", label: "Awards Won", icon: Award },
];

const FounderStory = () => (
  <section className="bg-[#0d0d0d] py-16 relative overflow-hidden">
    {/* Gold diagonal accent */}
    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

    <div className="container">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Story */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">Our Story</span>
          </div>
          <h2 className="font-black text-4xl text-white leading-tight mb-2">
            Arabic Authentic Flavors
          </h2>
          <h3 className="font-black text-4xl text-[#c9a84c] mb-6">with an Indian Twist</h3>

          {/* Quote */}
          <div className="relative pl-6 border-l-2 border-[#c9a84c]/40 mb-6">
            <Quote className="absolute -left-3.5 -top-1 h-6 w-6 text-[#c9a84c] bg-[#0d0d0d] p-0.5" />
            <p className="text-gray-400 leading-relaxed text-sm italic">
              "At Street Arabiya, we blend the bold, traditional flavors of Arabic cuisine with a
              touch of Indian flair, creating dishes that cater to the unique tastes of our guests.
              From juicy shawarmas and flavorful mandi to mouthwatering kebabs, BBQ, and indulgent
              Arabic desserts, every item is crafted to bring you the best of both worlds."
            </p>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            What started as a humble food truck has grown into 10+ restaurants across Tamil Nadu &
            Kerala, serving over 2 lakh loyal customers. Our commitment: top-quality food, trust,
            and an experience you'll love every single time.
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20">
              <span className="text-lg">🕌</span>
              <span className="text-xs font-semibold text-[#c9a84c]">100% Halal</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#fc8019]/10 border border-[#fc8019]/20">
              <span className="text-lg">👨‍🍳</span>
              <span className="text-xs font-semibold text-[#fc8019]">Qualified Chefs</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="text-lg">🌿</span>
              <span className="text-xs font-semibold text-green-500">Best Quality</span>
            </div>
          </div>
        </div>

        {/* Right: Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const colors = ["#c9a84c", "#fc8019", "#e23744", "#10b981"];
            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6 text-center hover:border-current transition-all duration-300 hover:-translate-y-1"
                style={{ color: colors[i] }}
              >
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-all group-hover:scale-110"
                  style={{ background: `${colors[i]}18`, border: `1px solid ${colors[i]}30` }}
                >
                  <Icon className="h-5 w-5" style={{ color: colors[i] }} />
                </div>
                <div className="font-black text-3xl text-white">{stat.num}</div>
                <div className="mt-1 text-xs font-semibold text-gray-500">{stat.label}</div>
              </div>
            );
          })}

          {/* Wide banner */}
          <div className="col-span-2 rounded-2xl overflow-hidden relative">
            <div className="bg-gradient-to-r from-[#c9a84c] to-[#8b6914] p-5 flex items-center justify-between">
              <div>
                <div className="font-black text-black text-lg">Where Good Food</div>
                <div className="font-black text-black text-lg">Meets Fast Delivery</div>
                <p className="text-black/70 text-xs mt-1">Delivering joy across 25+ locations</p>
              </div>
              <div className="text-5xl">🚀</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FounderStory;
