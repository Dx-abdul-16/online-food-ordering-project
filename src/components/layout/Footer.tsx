import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">F</span>
              </div>
              <span className="font-serif text-xl font-bold text-foreground">FoodExpress</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Delivering happiness to your doorstep. Order from the best restaurants in your city.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/restaurants" className="text-muted-foreground transition-colors hover:text-primary">
                  Browse Restaurants
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-muted-foreground transition-colors hover:text-primary">
                  Today's Offers
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/partner" className="text-muted-foreground transition-colors hover:text-primary">
                  Partner With Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>123 Food Street, Mumbai, Maharashtra 400001, India</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@foodexpress.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FoodExpress. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
