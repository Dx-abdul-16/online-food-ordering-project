# 🥙 FoodExpress – Full Stack Online Food Ordering System

## 🎓 Final Year Project Submission (React + Flask + MySQL)

FoodExpress is a premium, full-stack food delivery platform designed for high-end user experiences. It features a triple-role architecture (User, Restaurant, Admin, Delivery) with real-time tracking and secure payment integration.

---

## 🏛️ Project Architecture

The platform follows a standard **Full-Stack SaaS Architecture**:

- **Frontend**: React 18 with TypeScript, Tailwind CSS, and Framer Motion for premium animations.
- **Backend**: Python Flask RESTful API.
- **Database**: MySQL (Relational Schema for Orders, Users, & Restaurants).
- **Payments**: Razorpay Gateway Integration.
- **Geolocation**: OpenStreetMap (Nominatim) for precision delivery tracking.

---

## 🔥 Key Features

### 1. 🍱 Multi-Role Dashboards

- **User Dashboard**: Order history, active tracking, and profile management.
- **Restaurant Interface**: Kitchen manager for preparing orders and menu control.
- **Admin Command Center**: Real-time sales analytics, revenue tracking, and partner verification.
- **Delivery Hub**: Live logistics tracking and trip management.

### 2. 💳 Premium Checkout & Payments

- **Razorpay Integration**: Supports UPI, NetBanking, and Credit/Debit cards.
- **Dynamic Cart**: Real-time total calculation with automatic tax/delivery fee logic.
- **Secure Sessions**: JWT-based authentication for all private routes.

### 3. 🗺️ Location & Logistics

- **Precision Geocoding**: Automatic address detection even behind HTTP/Insecure contexts.
- **Interactive Maps**: Leaflet-based pin placement for delivery accuracy.

---

## 📊 Database Schema (MySQL)

### `users` Table

| Column        | Type     | Description                       |
| :------------ | :------- | :-------------------------------- |
| `id`          | INT (PK) | Unique User Identifier            |
| `username`    | VARCHAR  | Required for login                |
| `role`        | ENUM     | admin, restaurant, delivery, user |
| `is_approved` | BOOLEAN  | Verification for partners         |

### `orders` Table

| Column         | Type     | Description                   |
| :------------- | :------- | :---------------------------- |
| `id`           | INT (PK) | Transaction ID                |
| `total_amount` | DECIMAL  | Grand total with taxes        |
| `payment_id`   | VARCHAR  | Razorpay Payment Reference    |
| `status`       | VARCHAR  | pending, preparing, delivered |

---

## 🚀 Installation & Setup

### 1. Backend Setup (Flask)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

### 2. Frontend Setup (Vite)

```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Config

Create a `.env` in the `frontend` folder:

```env
VITE_API_BASE_URL="http://127.0.0.1:5000"
VITE_RAZORPAY_KEY="rzp_test_xxxxxxx"
```

---

## 🎨 Design Philosophy: "Jet Black & Honey Tan"

The UI is built on a **Luxury Dark Theme** using:

- **Primary**: `#c9a84c` (Honey Tan / Gold)
- **Background**: `#0d0d0d` (Pure Black)
- **Interactions**: Subtle glassmorphism and spring-based animations.

---

## 📜 Project Report Content (For Viva)

- **Problem Statement**: Bridging the gap between high-end Arabic cuisine and fast delivery logistics.
- **Solution**: A centralized platform with separate logic for kitchen and courier, integrated with a secure transaction layer.
- **Conclusion**: Successfully implemented a scalable ordering system capable of handling concurrent transactions and real-time logistics.
