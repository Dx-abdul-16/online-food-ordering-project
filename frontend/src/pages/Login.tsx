import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import { User, Store, Truck, Shield, Loader2 } from "lucide-react";
import { signInWithGoogle } from "@/lib/firebase";
import { toast } from "sonner";

const roles = [
  { id: "user", label: "Customer", icon: User, description: "Order food from restaurants" },
  { id: "hotel", label: "Restaurant", icon: Store, description: "Manage your restaurant" },
  { id: "delivery", label: "Delivery", icon: Truck, description: "Deliver orders" },
  { id: "admin", label: "Admin", icon: Shield, description: "Manage platform" },
];


const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });


  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const data = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        console.log('Login successful:', data);
        if (data.success && data.user) {
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(data.user));

          const role = data.user.role;
          if (role === 'admin') navigate('/admin/dashboard');
          else if (role === 'hotel') navigate('/restaurant/dashboard');
          else if (role === 'delivery') navigate('/delivery/dashboard');
          else navigate('/user/dashboard');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          setLoading(false);
          return;
        }
        const data = await api.post('/auth/signup', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        console.log('Signup successful:', data);
        if (data.success) {
          setIsLogin(true); // Switch to login after signup
        }
      }
    } catch (error: any) {
      console.error('Auth Error:', error);
      alert("Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] p-4 font-sans text-white relative overflow-hidden">
      {/* Background radial glow matching home page */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#c9a84c]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#c9a84c]/5 rounded-full blur-[100px]"></div>

      <Card className="w-full max-w-md bg-[#111111]/80 backdrop-blur-xl border border-[#2a2a2a] text-white shadow-2xl rounded-[2.5rem] relative z-10">
        <CardHeader className="space-y-1 text-center pt-10">
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#c9a84c] to-[#8b6914] flex items-center justify-center shadow-lg shadow-[#c9a84c]/20">
              <Shield className="h-7 w-7 text-black" />
            </div>
          </div>
          <CardTitle className="text-4xl font-black tracking-tighter uppercase italic">
            {isLogin ? "IDENTITY VERIFY" : "CREATE ACCOUNT"}
          </CardTitle>
          <CardDescription className="text-gray-500 font-medium tracking-tight">
            {isLogin ? "Secure access to your luxury food portal" : "Join the premium FoodExpress network today"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Input
                  id="username"
                  placeholder="Username"
                  className="border-none bg-white py-6 text-black placeholder:text-gray-500"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            )}

                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    className="bg-black/50 border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c] ring-0 transition-all font-medium"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="bg-black/50 border-[#2a2a2a] text-white h-12 rounded-xl focus:border-[#c9a84c] ring-0 transition-all font-medium"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="border-none bg-white py-6 text-black placeholder:text-gray-500"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`cursor-pointer rounded-xl p-3 text-center text-xs font-black uppercase tracking-widest transition-all border ${
                    formData.role === role.id 
                      ? 'bg-[#c9a84c]/20 border-[#c9a84c] text-[#c9a84c]' 
                      : 'bg-black/40 border-[#2a2a2a] text-gray-500 hover:border-gray-600'
                  }`}
                  onClick={() => setFormData({ ...formData, role: role.id })}
                >
                  {role.label}
                </div>
              ))}
            </div>
              </>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tighter">
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-400 transition-colors">
                  <input type="checkbox" className="rounded border-[#2a2a2a] bg-black/40" />
                  Remember Access
                </label>
                <Link to="/forgot-password" className="text-[#c9a84c] hover:underline">Lost Credentials?</Link>
              </div>
            )}

            <Button
              className="w-full bg-[#c9a84c] text-black hover:bg-[#b8943d] h-14 rounded-2xl font-black text-lg transition-all shadow-xl shadow-[#c9a84c]/10 active:scale-95"
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? "INITIALIZE SESSION" : "CONFIRM PROFILE")}
            </Button>

            {(isLogin || formData.role === 'user') && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#110c2a] px-2 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full bg-white text-black hover:bg-gray-100 py-6 text-lg font-bold rounded-xl flex items-center justify-center gap-2"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const { user, token } = await signInWithGoogle();
                      const res = await api.post('/auth/google', {
                        token: token,
                        email: user.email,
                        name: user.displayName,
                        firebaseAuth: true
                      });
                      
                      if (res.success && res.user) {
                        localStorage.setItem('user', JSON.stringify(res.user));
                        const role = res.user.role;
                        if (role === 'admin') navigate('/admin/dashboard');
                        else if (role === 'hotel') navigate('/restaurant/dashboard');
                        else if (role === 'delivery') navigate('/delivery/dashboard');
                        else navigate('/user/dashboard');
                      }
                    } catch (error: any) {
                      console.error('Firebase Auth Error:', error);
                      const errMsg = error.message || "Google Sign-In failed.";
                      toast.error(errMsg);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                  Continue with Google
                </Button>
              </>
            )}

          </form>

          <div className="mt-8 text-center text-xs font-medium text-gray-500">
            {isLogin ? "New to the luxury network? " : "Already authenticated? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-black text-[#c9a84c] hover:underline uppercase tracking-tighter"
            >
              {isLogin ? "Create Profile" : "Login Now"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
