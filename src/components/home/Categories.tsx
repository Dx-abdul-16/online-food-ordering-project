import { Link } from "react-router-dom";

const categories = [
  { name: "Biryani", emoji: "🍚", count: 120 },
  { name: "Pizza", emoji: "🍕", count: 85 },
  { name: "Burgers", emoji: "🍔", count: 72 },
  { name: "North Indian", emoji: "🍛", count: 150 },
  { name: "South Indian", emoji: "🥘", count: 95 },
  { name: "Chinese", emoji: "🥡", count: 88 },
  { name: "Desserts", emoji: "🍰", count: 65 },
  { name: "Beverages", emoji: "🥤", count: 45 },
];

const Categories = () => {
  return (
    <section className="bg-background py-16">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground">
            What's on your mind?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Browse through popular cuisines
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/restaurants?category=${category.name.toLowerCase()}`}
              className="group flex flex-col items-center rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl transition-transform group-hover:scale-110">
                {category.emoji}
              </div>
              <span className="mt-3 font-medium text-foreground">{category.name}</span>
              <span className="text-xs text-muted-foreground">{category.count} places</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
