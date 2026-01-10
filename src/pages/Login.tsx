import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import { User, Store, Truck, Shield } from "lucide-react";

const roles = [
  { id: "user", label: "Customer", icon: User, description: "Order food from restaurants" },
  { id: "hotel", label: "Restaurant", icon: Store, description: "Manage your restaurant" },
  { id: "delivery", label: "Delivery", icon: Truck, description: "Deliver orders" },
  { id: "admin", label: "Admin", icon: Shield, description: "Manage platform" },
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("user");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container flex min-h-[calc(100vh-64px)] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to continue to FoodExpress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-4 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-all ${
                    selectedRole === role.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <role.icon className={`h-5 w-5 ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs font-medium ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`}>
                    {role.label}
                  </span>
                </button>
              ))}
            </div>

            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
                <Button className="w-full">Sign In</Button>
                <p className="text-center text-sm text-muted-foreground">
                  <a href="#" className="text-primary hover:underline">Forgot password?</a>
                </p>
              </TabsContent>
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="name@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="••••••••" />
                </div>
                <Button className="w-full">Create Account</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;
