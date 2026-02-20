/**
 * OfferBanners – Swiggy/Zomato style promotional banner strip
 */
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Tag, Truck } from "lucide-react";

const offers = [
  {
    id: 1,
    title: "50% OFF",
    subtitle: "Up to ₹100 on first order",
    desc: "Use code FIRST50",
    icon: Tag,
    bg: "from-[#e23744] to-[#b02030]",
    link: "/restaurants",
    badge: "NEW USER",
  },
  {
    id: 2,
    title: "Free Delivery",
    subtitle: "On orders above ₹299",
    desc: "No code needed",
    icon: Truck,
    bg: "from-[#fc8019] to-[#d4670e]",
    link: "/restaurants",
    badge: "TODAY ONLY",
  },
  {
    id: 3,
    title: "30 Min",
    subtitle: "Guaranteed delivery",
    desc: "Or your next order free",
    icon: Clock,
    bg: "from-[#c9a84c] to-[#8b6914]",
    link: "/restaurants",
    badge: "PROMISE",
  },
];

const OfferBanners = () => (
  <section className="bg-[#0d0d0d] py-8">
    <div className="container">
      <div className="grid gap-4 sm:grid-cols-3">
        {offers.map((offer) => {
          const Icon = offer.icon;
          return (
            <Link
              key={offer.id}
              to={offer.link}
              className="group relative overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <div
                className={`relative p-6 bg-gradient-to-br ${offer.bg} flex items-center gap-4`}
              >
                {/* Decorative circle */}
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                <div className="absolute -right-2 -bottom-4 h-16 w-16 rounded-full bg-white/5" />

                {/* Badge */}
                <div className="absolute top-3 right-3 rounded-full bg-black/30 px-2 py-0.5 text-[9px] font-black tracking-widest text-white">
                  {offer.badge}
                </div>

                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Text */}
                <div>
                  <div className="font-black text-2xl text-white leading-none">{offer.title}</div>
                  <div className="text-sm font-semibold text-white/90 mt-0.5">{offer.subtitle}</div>
                  <div className="text-xs text-white/70 mt-1">{offer.desc}</div>
                </div>

                <ArrowRight className="ml-auto h-5 w-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

export default OfferBanners;
