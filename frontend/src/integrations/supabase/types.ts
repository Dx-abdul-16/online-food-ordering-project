/**
 * API type definitions for FoodExpress
 * Backend: Python Flask + MySQL (migrated FROM Supabase)
 *
 * These types mirror the MySQL schema defined in backend/schema.sql
 */

// ── Users ────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "hotel" | "delivery";
  address?: string;
  latitude?: number;
  longitude?: number;
  is_approved?: boolean;
  created_at?: string;
}

// ── Restaurants ──────────────────────────────────────────────────────────────
export interface Restaurant {
  id: number;
  owner_id?: number;
  name: string;
  cuisine?: string;
  image?: string;
  rating?: number;
  deliveryTime?: string;     // formatted, e.g. "25-35 min"
  delivery_time?: string;    // raw from DB
  location?: string;
  latitude?: number;
  longitude?: number;
  priceForTwo?: number;
  price_for_two?: number;
  is_veg?: boolean;
  isVeg?: boolean;
  offer?: string;
  tags?: string[];
  menu?: MenuItem[];
}

// ── Menu Items ────────────────────────────────────────────────────────────────
export interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  is_veg?: boolean;
  isVeg?: boolean;
  category?: string;
}

// ── Orders ────────────────────────────────────────────────────────────────────
export interface Order {
  id: number;
  user_id: number;
  restaurant_id: number;
  total_amount: number;
  status: "pending" | "confirmed" | "preparing" | "on_the_way" | "delivered" | "cancelled";
  payment_method?: string;
  delivery_address?: string;
  created_at?: string;
  restaurant_name?: string;
  restaurant_image?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  item_name?: string;
}

// ── Cart (client-side only) ──────────────────────────────────────────────────
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: number;
  image?: string;
}

// ── Delivery Tracking ─────────────────────────────────────────────────────────
export interface DeliveryTracking {
  id: number;
  order_id: number;
  latitude: number;
  longitude: number;
  updated_at?: string;
}

// ── API Responses ─────────────────────────────────────────────────────────────
export interface ApiSuccess<T = any> {
  success: true;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;
