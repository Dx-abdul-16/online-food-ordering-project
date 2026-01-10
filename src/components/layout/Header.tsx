import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/restaurants", label: "Restaurants" },
    { href: "/offers", label: "Offers" },
    { href: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">F</span>
            </div>
            <span className="hidden font-serif text-xl font-bold text-foreground sm:inline-block">
              FoodExpress
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden gap-2 sm:flex">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="max-w-[150px] truncate text-sm">Mumbai, India</span>
          </Button>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-primary-foreground">
                0
              </Badge>
            </Button>
          </Link>

          <Link to="/login" className="hidden sm:block">
            <Button variant="outline" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              Login
            </Button>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card">
              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-4 h-px bg-border" />
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full gap-2">
                    <User className="h-4 w-4" />
                    Login / Sign Up
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
