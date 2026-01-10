import { Link } from "react-router-dom";
import { Star, Clock, MapPin, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const restaurants = [
  {
    id: 1,
    name: "Taj Mahal Kitchen",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    cuisine: "North Indian, Mughlai",
    rating: 4.5,
    deliveryTime: "25-30 min",
    location: "Andheri West",
    priceForTwo: 500,
    isVeg: false,
    offer: "20% OFF",
  },
  {
    id: 2,
    name: "Green Leaf Restaurant",
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop",
    cuisine: "South Indian, Pure Veg",
    rating: 4.3,
    deliveryTime: "20-25 min",
    location: "Bandra",
    priceForTwo: 350,
    isVeg: true,
    offer: "Free Delivery",
  },
  {
    id: 3,
    name: "Dragon Palace",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
    cuisine: "Chinese, Thai",
    rating: 4.2,
    deliveryTime: "30-35 min",
    location: "Juhu",
    priceForTwo: 600,
    isVeg: false,
    offer: null,
  },
  {
    id: 4,
    name: "Pizza Paradise",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    cuisine: "Italian, Pizza",
    rating: 4.6,
    deliveryTime: "25-30 min",
    location: "Malad",
    priceForTwo: 450,
    isVeg: false,
    offer: "Buy 1 Get 1",
  },
  {
    id: 5,
    name: "Biryani House",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
    cuisine: "Hyderabadi, Biryani",
    rating: 4.7,
    deliveryTime: "35-40 min",
    location: "Powai",
    priceForTwo: 550,
    isVeg: false,
    offer: "₹100 OFF",
  },
  {
    id: 6,
    name: "Dosa Delight",
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop",
    cuisine: "South Indian, Dosa",
    rating: 4.4,
    deliveryTime: "20-25 min",
    location: "Dadar",
    priceForTwo: 300,
    isVeg: true,
    offer: "15% OFF",
  },
];

const FeaturedRestaurants = () => {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Top Restaurants Near You
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked restaurants with great food and service
            </p>
          </div>
          <Link
            to="/restaurants"
            className="hidden text-sm font-medium text-primary hover:underline sm:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`}>
              <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {restaurant.offer && (
                    <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
                      {restaurant.offer}
                    </Badge>
                  )}
                  {restaurant.isVeg && (
                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                      <Leaf className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{restaurant.cuisine}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-md bg-accent px-2 py-1">
                      <Star className="h-3 w-3 fill-accent-foreground text-accent-foreground" />
                      <span className="text-sm font-medium text-accent-foreground">{restaurant.rating}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {restaurant.deliveryTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {restaurant.location}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    ₹{restaurant.priceForTwo} for two
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/restaurants"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All Restaurants →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
