import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Register from "./pages/Register";
import RestaurantDetails from "./pages/RestaurantDetails";
import Restaurants from "./pages/Restaurants";
import OrderTracking from "./pages/OrderTracking";
import { CartProvider } from "./context/CartContext";
import { Cart } from "./components/cart/Cart";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import AIChatbot from "./components/AIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['hotel']} />}>
              <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['delivery']} />}>
              <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* Public Routes */}
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Cart />
          <AIChatbot />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
