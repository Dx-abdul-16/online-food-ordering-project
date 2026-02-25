import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store, Truck, Shield, ChevronRight } from "lucide-react";

const PartnerSection = () => (
  <section className="bg-[#111111] py-16 relative overflow-hidden">
    {/* Decorative top line */}
    <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />

    <div className="container">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-12 bg-[#c9a84c]/40" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">Partnership</span>
          <div className="h-px w-12 bg-[#c9a84c]/40" />
        </div>
        <h2 className="font-black text-3xl text-white">Grow With Us</h2>
        <p className="mt-2 text-gray-500 text-sm">Join our ecosystem and scale your business</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Partner with us */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#141414] p-8 hover:border-[#fc8019]/30 transition-all hover:-translate-y-0.5 hover:shadow-xl">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#fc8019]/5 -translate-y-16 translate-x-16" />
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fc8019]/15 border border-[#fc8019]/20 group-hover:scale-110 transition-transform">
            <Store className="h-7 w-7 text-[#fc8019]" />
          </div>
          <h3 className="font-black text-xl text-white mb-2">Partner with us</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            List your restaurant on FoodExpress and reach thousands of hungry customers in Saravanampatti, Coimbatore.
            Increase your orders and grow your business digitally.
          </p>
          <ul className="space-y-2 mb-6">
            {["Easy onboarding in 24 hours", "Real-time order dashboard", "Dedicated support team", "Weekly payouts guaranteed"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-3.5 w-3.5 text-[#fc8019] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/register?role=hotel">
            <Button className="w-full bg-[#fc8019] hover:bg-[#e07010] text-white font-bold rounded-xl gap-2">
              Register Restaurant <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Ride with us */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#141414] p-8 hover:border-[#c9a84c]/30 transition-all hover:-translate-y-0.5 hover:shadow-xl">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#c9a84c]/5 -translate-y-16 translate-x-16" />
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c9a84c]/15 border border-[#c9a84c]/20 group-hover:scale-110 transition-transform">
            <Truck className="h-7 w-7 text-[#c9a84c]" />
          </div>
          <h3 className="font-black text-xl text-white mb-2">Ride with us</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Become a delivery partner and earn money on your own schedule. Flexible hours, weekly
            payouts, and great incentives for top performers.
          </p>
          <ul className="space-y-2 mb-6">
            {["Flexible working hours", "₹500+ daily earnings", "Weekly payouts every Monday", "Insurance & health benefits"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-3.5 w-3.5 text-[#c9a84c] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/register?role=delivery">
            <Button className="w-full bg-[#c9a84c] hover:bg-[#b8943d] text-black font-bold rounded-xl gap-2">
              Become Delivery Partner <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default PartnerSection;
