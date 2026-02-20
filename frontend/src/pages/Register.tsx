import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Bike, User, Shield, ChefHat, Loader2, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user"
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.phone) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/signup", formData);
      if (res.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (err) {
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: "user", label: "Customer", icon: User, color: "text-[#c9a84c]", bg: "bg-[#c9a84c]/10" },
    { id: "delivery", label: "Delivery Partner", icon: Bike, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "hotel", label: "Restaurant Owner", icon: ChefHat, color: "text-orange-500", bg: "bg-orange-500/10" }
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6 font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#c9a84c] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px]"></div>
      </div>

      <Card className="w-full max-w-xl bg-black/40 backdrop-blur-3xl border-[#2a2a2a] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <CardHeader className="text-center pt-10 pb-6">
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#c9a84c] to-[#b8943d] flex items-center justify-center shadow-lg shadow-[#c9a84c]/20">
              <Shield className="h-7 w-7 text-black" />
            </div>
          </div>
          <CardTitle className="text-4xl font-black text-white tracking-tighter mb-2">Create Account</CardTitle>
          <CardDescription className="text-gray-500 font-medium italic">Join the FoodExpress premium logistics network</CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-10">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r.id })}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    formData.role === r.id 
                    ? `border-[#c9a84c] ${r.bg} scale-105` 
                    : 'border-[#1e1e1e] bg-transparent hover:border-[#333]'
                  }`}
                >
                  <r.icon className={`h-6 w-6 mb-2 ${formData.role === r.id ? r.color : 'text-gray-500'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${formData.role === r.id ? 'text-white' : 'text-gray-600'}`}>
                    {r.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-gray-500 ml-1">Username</Label>
                <div className="relative">
                  <Input 
                    placeholder="e.g. john_doe"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="bg-black/50 border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c] pl-10 ring-0 transition-all" 
                  />
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-600" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-gray-500 ml-1">Phone Number</Label>
                <Input 
                  placeholder="+91 00000 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-black/50 border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c] ring-0 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-gray-500 ml-1">Email Address</Label>
              <Input 
                type="email" 
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-black/50 border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c] ring-0 transition-all" 
              />
            </div>

            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black tracking-widest text-gray-500 ml-1">Security Password</Label>
              <Input 
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-black/50 border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c] ring-0 transition-all" 
              />
            </div>

            {formData.role === 'delivery' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                 <div className="space-y-2">
                    <Label className="uppercase text-[10px] font-black tracking-widest text-[#3b82f6] ml-1">Driving License Number</Label>
                    <Input 
                      placeholder="DL-0000000000"
                      className="bg-blue-500/5 border-blue-500/20 text-white h-12 rounded-xl focus:border-blue-500 ring-0 transition-all font-bold" 
                    />
                 </div>
                 <div className="p-4 rounded-2xl border-2 border-dashed border-[#2a2a2a] bg-black/20 flex flex-col items-center justify-center gap-2">
                    <Bike className="h-6 w-6 text-gray-600" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Upload Digital Copy of License (PNG/PDF)</p>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] font-black bg-transparent border-[#2a2a2a] text-gray-400">SELECT FILE</Button>
                 </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#c9a84c] text-black hover:bg-[#b8943d] h-14 rounded-2xl font-black text-lg transition-all shadow-xl shadow-[#c9a84c]/10 active:scale-95 flex gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>START JOURNEY <ArrowRight className="h-5 w-5" /></>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-[#1e1e1e] bg-black/20 p-6">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-[#c9a84c] hover:underline font-black uppercase tracking-tighter">Login here</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
