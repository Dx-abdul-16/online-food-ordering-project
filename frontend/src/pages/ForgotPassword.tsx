
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', {
        email: formData.email,
        newPassword: formData.newPassword
      });

      if (res.success) {
        toast.success("Password reset successfully!");
        navigate('/login');
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (error: any) {
      console.error('Reset Password Error:', error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a103d] p-4 font-sans text-white">
      <Card className="w-full max-w-md border-none bg-[#110c2a] text-white shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter your email and new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                className="border-none bg-white py-6 text-black placeholder:text-gray-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                id="newPassword"
                type="password"
                placeholder="New Password"
                className="border-none bg-white py-6 text-black placeholder:text-gray-500"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
              />
            </div>

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

            <Button
              className="w-full bg-[#5e17eb] py-6 text-lg font-semibold hover:bg-[#4a12bd]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <div className="mt-4 text-center">
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
