import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Store, Truck, Shield } from "lucide-react";

const PartnerSection = () => {
  return (
    <section className="bg-foreground py-16 text-card">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-card/10 p-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Store className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="font-serif text-2xl font-bold">Partner with us</h3>
            <p className="mt-3 text-card/80">
              List your restaurant on FoodExpress and reach millions of hungry customers. 
              Increase your orders and grow your business.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-card/70">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Easy onboarding process
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Real-time order management
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Dedicated support team
              </li>
            </ul>
            <Link to="/hotel/register">
              <Button className="mt-6">Register Your Restaurant</Button>
            </Link>
          </div>

          <div className="rounded-2xl bg-card/10 p-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
              <Truck className="h-7 w-7 text-secondary-foreground" />
            </div>
            <h3 className="font-serif text-2xl font-bold">Ride with us</h3>
            <p className="mt-3 text-card/80">
              Become a delivery partner and earn money on your own schedule. 
              Flexible hours, weekly payouts, and great incentives.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-card/70">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-secondary" />
                Flexible working hours
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-secondary" />
                Weekly payouts
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-secondary" />
                Insurance coverage
              </li>
            </ul>
            <Link to="/delivery/register">
              <Button variant="secondary" className="mt-6">
                Become a Delivery Partner
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
