import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative min-h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      <div className="container relative z-10 flex min-h-[600px] flex-col items-start justify-center py-20">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl font-bold leading-tight text-card sm:text-5xl md:text-6xl">
            Delicious Food,
            <span className="block text-primary">Delivered Fast</span>
          </h1>
          <p className="mt-4 text-lg text-card/80 sm:text-xl">
            Order from the best restaurants in your city. Fresh, hot meals delivered to your doorstep in minutes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your delivery address"
                className="h-12 bg-card pl-10 text-foreground placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="h-12 gap-2 px-8">
              <Search className="h-5 w-5" />
              Find Food
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <span className="text-lg">🍕</span>
              </div>
              <span className="text-sm font-medium text-card">500+ Restaurants</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <span className="text-lg">⏱️</span>
              </div>
              <span className="text-sm font-medium text-card">30 Min Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <span className="text-lg">🎉</span>
              </div>
              <span className="text-sm font-medium text-card">Daily Offers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
