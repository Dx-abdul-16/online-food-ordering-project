import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Bike, User, Shield, ChefHat, Loader2, ArrowRight, Store, FileText, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const ROLE_CONFIG: Record<string, { title: string; subtitle: string; icon: any; accent: string; bgGlow: string }> = {
  user: {
    title: "Customer Account",
    subtitle: "Join FoodExpress and start ordering your favourite food",
    icon: User,
    accent: "#c9a84c",
    bgGlow: "bg-[#c9a84c]",
  },
  hotel: {
    title: "Restaurant Registration",
    subtitle: "List your restaurant on FoodExpress and reach thousands of customers",
    icon: Store,
    accent: "#fc8019",
    bgGlow: "bg-orange-500",
  },
  delivery: {
    title: "Delivery Partner",
    subtitle: "Join our delivery fleet — driving license is mandatory",
    icon: Bike,
    accent: "#3b82f6",
    bgGlow: "bg-blue-500",
  },
};

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const role = roleParam && ROLE_CONFIG[roleParam] ? roleParam : "user";
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;

  const [loading, setLoading] = useState(false);
  const [licenseUploading, setLicenseUploading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role,
    name: "",
    drivingLicense: "",
    drivingLicenseImage: "",
    restaurantName: "",
    restaurantLocation: "",
  });

  const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLicenseUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.upload("/uploads/image", fd);
      if (res.success) {
        setFormData({ ...formData, drivingLicenseImage: res.url });
        toast.success("License image uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Failed to upload license image");
    } finally {
      setLicenseUploading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate driving license for delivery partners
    if (role === "delivery") {
      if (!formData.drivingLicense) {
        toast.error("Driving license number is mandatory for delivery partners!");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        name: formData.name || formData.username,
      };
      const res = await api.post("/auth/signup", payload);
      if (res.success) {
        if (role === "delivery") {
          toast.success("🎉 Registration submitted! Pending admin approval. Check your email.", { duration: 6000 });
        } else if (role === "hotel") {
          toast.success("🎉 Restaurant registration submitted! Pending admin approval.", { duration: 6000 });
        } else {
          toast.success("✅ Registration successful! Check your email. Please login.", { duration: 5000 });
        }
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

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6 font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className={`absolute top-[-10%] right-[-5%] w-[40%] h-[40%] ${config.bgGlow} rounded-full blur-[120px]`}></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px]"></div>
      </div>

      <Card className="w-full max-w-xl bg-black/40 backdrop-blur-3xl border-[#2a2a2a] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <CardHeader className="text-center pt-10 pb-6">
          <div className="flex justify-center mb-6">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(135deg, ${config.accent}, ${config.accent}bb)`, boxShadow: `0 8px 24px ${config.accent}30` }}
            >
              <Icon className="h-7 w-7 text-black" />
            </div>
          </div>
          <CardTitle className="text-4xl font-black text-white tracking-tighter mb-2">{config.title}</CardTitle>
          <CardDescription className="text-gray-500 font-medium italic">{config.subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="px-10 pb-10">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-gray-500 ml-1">Full Name</Label>
                <div className="relative">
                  <Input
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-black/50 border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c] pl-10 ring-0 transition-all"
                  />
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-600" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-black tracking-widest text-gray-500 ml-1">Username</Label>
                <Input
                  placeholder="e.g. john_doe"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-black/50 border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c] ring-0 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label className="uppercase text-[10px] font-black tracking-widest text-gray-500 ml-1">Security Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-black/50 border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c] ring-0 transition-all"
              />
            </div>

            {/* Restaurant-specific fields */}
            {role === "hotel" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-3 flex items-center gap-2">
                    <Store className="h-3.5 w-3.5" /> Restaurant Details
                  </p>
                  <div className="space-y-3">
                    <Input
                      placeholder="Restaurant Name (e.g. Street Arabiya)"
                      value={formData.restaurantName}
                      onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                      className="bg-black/30 border-orange-500/20 text-white h-12 rounded-xl focus:border-orange-500 ring-0 transition-all font-bold"
                    />
                    <Input
                      placeholder="Location (e.g. Saravanampatti, Coimbatore)"
                      value={formData.restaurantLocation}
                      onChange={(e) => setFormData({ ...formData, restaurantLocation: e.target.value })}
                      className="bg-black/30 border-orange-500/20 text-white h-12 rounded-xl focus:border-orange-500 ring-0 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                  <p className="text-[10px] text-orange-400 font-bold text-center">
                    ⏳ Restaurant accounts require admin approval before activation
                  </p>
                </div>
              </div>
            )}

            {/* Delivery-specific fields - MANDATORY LICENSE */}
            {role === "delivery" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 rounded-2xl border-2 border-blue-500/30 bg-blue-500/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3 flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" /> DRIVING LICENSE (MANDATORY)
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-black tracking-widest text-blue-400 ml-1">
                        License Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="DL-0000000000"
                        value={formData.drivingLicense}
                        onChange={(e) => setFormData({ ...formData, drivingLicense: e.target.value })}
                        className="bg-black/30 border-blue-500/20 text-white h-12 rounded-xl focus:border-blue-500 ring-0 transition-all font-bold font-mono tracking-wider"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-black tracking-widest text-blue-400 ml-1">
                        Upload License Image
                      </Label>
                      <div className="p-4 rounded-2xl border-2 border-dashed border-blue-500/20 bg-black/20 flex flex-col items-center justify-center gap-3 relative">
                        {formData.drivingLicenseImage ? (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm font-bold">License uploaded successfully!</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-blue-500/50" />
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">
                              Upload Digital Copy of License (PNG/JPG)
                            </p>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={handleLicenseUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        {licenseUploading && (
                          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold">
                        ⏳ Delivery accounts require admin approval
                      </p>
                      <p className="text-[9px] text-gray-500 mt-1">
                        Your driving license will be verified by our admin team. You'll receive an email once approved or denied.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-black h-14 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 flex gap-2"
              style={{ background: `linear-gradient(135deg, ${config.accent}, ${config.accent}cc)`, boxShadow: `0 10px 30px ${config.accent}20` }}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>
                  {role === "user" && "CREATE ACCOUNT"}
                  {role === "hotel" && "REGISTER RESTAURANT"}
                  {role === "delivery" && "SUBMIT FOR APPROVAL"}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>

            {/* Links to other registration types */}
            <div className="pt-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Or register as</p>
              <div className="flex justify-center gap-3">
                {role !== "user" && (
                  <Link to="/register" className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#2a2a2a] text-gray-400 text-xs font-bold hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all">
                    <User className="h-3.5 w-3.5" /> Customer
                  </Link>
                )}
                {role !== "hotel" && (
                  <Link to="/register?role=hotel" className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#2a2a2a] text-gray-400 text-xs font-bold hover:border-orange-500/40 hover:text-orange-500 transition-all">
                    <ChefHat className="h-3.5 w-3.5" /> Restaurant
                  </Link>
                )}
                {role !== "delivery" && (
                  <Link to="/register?role=delivery" className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#2a2a2a] text-gray-400 text-xs font-bold hover:border-blue-500/40 hover:text-blue-500 transition-all">
                    <Bike className="h-3.5 w-3.5" /> Delivery
                  </Link>
                )}
              </div>
            </div>
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
