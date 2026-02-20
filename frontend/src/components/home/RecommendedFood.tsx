import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { useCart } from "@/context/CartContext";

const fallbackItems = [
  { id: "f1", name: "Chicken Shawarma", price: 149, restaurantId: 1, restaurantName: "Street Arabiya", emoji: "🥙", rating: 4.8 },
  { id: "f2", name: "Chicken Mandi", price: 349, restaurantId: 1, restaurantName: "Arabian Nights", emoji: "🍗", rating: 4.7 },
  { id: "f3", name: "Afghani Alfaham", price: 399, restaurantId: 2, restaurantName: "Al Bait", emoji: "🔥", rating: 4.9 },
  { id: "f4", name: "Mutton Biryani", price: 279, restaurantId: 3, restaurantName: "Biriyani House", emoji: "🍚", rating: 4.6 },
];

const RecommendedFood = () => {
  const { addToCart } = useCart();
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [added, setAdded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const restaurants: any[] = await api.get("/restaurants");
        let allItems: any[] = [];
        for (const r of restaurants.slice(0, 3)) {
          try {
            const details = await api.get(`/restaurants/${r.id}`);
            if (details.menu) {
              const items = details.menu.slice(0, 2).map((item: any) => ({
                ...item,
                restaurantId: r.id,
                restaurantName: r.name,
              }));
              allItems = [...allItems, ...items];
            }
          } catch (e) {
            console.error(e);
          }
        }
        if (allItems.length > 0) setFoodItems(allItems);
        else setFoodItems(fallbackItems);
      } catch {
        setFoodItems(fallbackItems);
      }
    };
    fetchRecommended();
  }, []);

  const handleAdd = (item: any) => {
    addToCart({ id: item.id, name: item.name, price: item.price, restaurantId: item.restaurantId });
    setAdded((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.id]: false })), 1200);
  };

  if (foodItems.length === 0) return null;

  return (
    <section className="bg-[#0d0d0d] py-14">
      <div className="container">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-8 rounded-full bg-[#e23744]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#e23744]">For You</span>
            </div>
            <h2 className="font-black text-3xl text-white">
              Recommended <span className="text-[#e23744]">For You</span>
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">Delicious dishes trending right now</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {foodItems.map((item, index) => (
            <Card
              key={`${item.id}-${index}`}
              className="group overflow-hidden bg-[#141414] border border-[#2a2a2a] hover:border-[#e23744]/30 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image / Emoji area */}
              <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300 select-none">
                    {item.emoji || "🍽️"}
                  </span>
                )}

                {/* Rating pill */}
                {item.rating && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/80 rounded-full px-2.5 py-1">
                    <Star className="h-3 w-3 fill-[#c9a84c] text-[#c9a84c]" />
                    <span className="text-xs font-bold">{item.rating}</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/80 via-transparent to-transparent" />
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-[15px] truncate group-hover:text-[#e23744] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{item.restaurantName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-lg text-white">₹{item.price}</span>
                  <Button
                    size="sm"
                    onClick={() => handleAdd(item)}
                    className={`h-8 w-8 rounded-full p-0 transition-all ${
                      added[item.id]
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-[#e23744] hover:bg-[#c02030]"
                    }`}
                  >
                    {added[item.id] ? (
                      <span className="text-xs">✓</span>
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedFood;
