-- FoodExpress Full Database Backup WITH DATA
SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `delivery_tracking`;
CREATE TABLE `delivery_tracking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `delivery_tracking_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `menu_items`;
CREATE TABLE `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `restaurant_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` float NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_veg` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `menu_items` (`id`, `restaurant_id`, `name`, `price`, `description`, `image`, `is_veg`) VALUES 
(1, 1, 'Butter Chicken', 350.0, 'Rich and creamy tomato gravy with tender chicken pieces.', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&h=200&fit=crop', 0),
(2, 1, 'Garlic Naan', 40.0, 'Soft bread topped with garlic and butter.', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200&h=200&fit=crop', 1),
(3, 1, 'Chicken Biryani', 280.0, 'Aromatic basmati rice cooked with spices and chicken.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop', 0),
(4, 1, 'Paneer Tikka Masala', 250.0, 'Marinated paneer cheese served in a spiced gravy.', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop', 1),
(5, 2, 'Masala Dosa', 120.0, 'Crispy crepe filled with spiced potato mix.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=200&fit=crop', 1),
(6, 2, 'Idli Sambar', 80.0, 'Steamed rice cakes served with lentil soup.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=200&fit=crop', 1),
(7, 2, 'Uttapam', 140.0, 'Thick savory pancake with vegetable toppings.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=200&fit=crop', 1),
(8, 3, 'ICECREAM', 71.0, '', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 0);

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `menu_item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `menu_item_id` (`menu_item_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `restaurant_id` int NOT NULL,
  `total_amount` float NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_id` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `delivery_address` text,
  `fulfillment_mode` varchar(50) DEFAULT 'delivery',
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `qr_code` text,
  `qr_hash` varchar(64) DEFAULT NULL,
  `delivery_partner_id` int DEFAULT NULL,
  `picked_up_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `customer_confirmed` enum('pending','received','not_received') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `restaurant_id` (`restaurant_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE `restaurants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `cuisine` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `rating` float DEFAULT '0',
  `delivery_time` varchar(50) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `price_for_two` int DEFAULT NULL,
  `is_veg` tinyint(1) DEFAULT '0',
  `latitude` double DEFAULT '11.0168',
  `longitude` double DEFAULT '76.9558',
  `offer` varchar(100) DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `restaurants` (`id`, `name`, `cuisine`, `image`, `rating`, `delivery_time`, `location`, `price_for_two`, `is_veg`, `latitude`, `longitude`, `offer`, `owner_id`) VALUES 
(1, 'Taj Mahal Kitchen', 'North Indian, Mughlai', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', 4.5, '25-30 min', 'Andheri West', 500, 0, 13.0827, 80.2707, '20% OFF', NULL),
(2, 'Green Leaf Restaurant', 'South Indian, Pure Veg', 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop', 4.3, '20-25 min', 'Bandra', 350, 1, 11.0168, 76.9558, 'Free Delivery', NULL),
(3, 'Spicy Chettinad Kitchen', 'South Indian, Chettinad', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=60', 4.5, '30-40 min', 'Anna Nagar, Chennai', 500, 0, 13.0827, 80.2707, '20% OFF', 2),
(4, 'Street Arabiya', 'Arabic, Shawarma, Mandi', 'https://images.unsplash.com/photo-1561626423-a51b45aef0a1?w=800&auto=format&fit=crop&q=60', 4.8, '25-35 min', 'Podanur, Coimbatore', 400, 0, 11.0036, 76.9639, '50% OFF up to ₹100', 6),
(5, 'Al-Bait Mandi House', 'Arabic, Mandi, Kebabs', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=60', 4.7, '30-40 min', 'Sai Baba Colony, Coimbatore', 600, 0, 11.0339, 76.9559, 'Free Delivery', 7),
(6, 'Coimbatore Biriyani Palace', 'Biryani, South Indian, Tandoor', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60', 4.5, '20-30 min', 'RS Puram, Coimbatore', 350, 0, 11.0075, 76.953, '20% OFF', 8);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `username` varchar(50) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `address` text,
  `status` int DEFAULT '1',
  `driving_license` varchar(50) DEFAULT NULL,
  `driving_license_image` varchar(255) DEFAULT NULL,
  `live_latitude` double DEFAULT NULL,
  `live_longitude` double DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT '0',
  `last_location_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `created_at`, `username`, `latitude`, `longitude`, `address`, `status`, `driving_license`, `driving_license_image`, `live_latitude`, `live_longitude`, `is_online`, `last_location_update`) VALUES 
(1, '', 'admin@gmail.com', 'Admin@123456', '', 'admin', '2026-02-10 20:01:08', 'Admin', NULL, NULL, '', 1, NULL, NULL, NULL, NULL, 0, '2026-03-01 10:13:43'),
(2, 'Restaurant Owner', 'restaurant@example.com', 'pass123', '9876543210', 'hotel', '2026-02-18 23:38:50', 'rest_owner', NULL, NULL, 'Anna Nagar, Chennai', 1, NULL, NULL, NULL, NULL, 0, '2026-03-01 10:13:43'),
(3, 'John Doe', 'user@example.com', 'pass123', '9123456780', 'user', '2026-02-18 23:38:50', 'johndoe', 13.0418, 80.2341, 'T. Nagar, Chennai', 1, NULL, NULL, NULL, NULL, 0, '2026-03-01 10:13:43'),
(4, 'customer', 'customer@example.com', 'password', '1234567890', 'user', '2026-02-25 13:34:59', NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, 0, '2026-03-01 10:13:43'),
(5, 'Ramesh Delivery', 'delivery@example.com', 'password123', '9876543210', 'delivery', '2026-02-19 00:08:05', 'ramesh_delivery', NULL, NULL, '', 1, NULL, NULL, NULL, NULL, 0, '2026-03-01 10:13:43'),
(6, 'Street Arabiya Owner', 'arabiya@foodexpress.in', 'arabiya123', '9629075139', 'hotel', '2026-02-20 18:08:23', 'arabiya_owner', 11.0036, 76.9639, 'Podanur Main Road, Coimbatore', 1, NULL, NULL, NULL, NULL, 0, '2026-03-01 10:13:43'),
(7, 'Al-Bait Owner', 'albait@foodexpress.in', 'albait123', '9876543221', 'hotel', '2026-02-20 18:08:23', 'albait_owner', 11.0339, 76.9559, 'Sai Baba Colony, Coimbatore', 1, NULL, NULL, NULL, NULL, 0, '2026-03-01 10:13:43'),
(8, 'Biriyani Palace Owner', 'biriyani@foodexpress.in', 'biriyani123', '9345678901', 'hotel', '2026-02-20 18:08:23', 'biriyani_owner', 11.0075, 76.953, 'RS Puram, Coimbatore', 1, NULL, NULL, NULL, NULL, 0, '2026-03-01 10:13:43'),
(9, 'Delivery Partner Pro', 'delivery@foodexpress.com', 'delivery123', '9876543210', 'delivery', '2026-02-20 21:34:01', 'delivery_pro', NULL, NULL, '', 1, NULL, NULL, NULL, NULL, 0, '2026-03-01 10:13:43'),
(10, NULL, 'smart@gmail.com', 'pass123', NULL, 'user', '2026-02-26 09:16:51', 'SMART', NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, 0, '2026-03-01 10:13:43'),
(11, NULL, 'tehaioyhega@gmail.com', '34jwerp', '5545218512', 'hotel', '2026-02-26 09:20:36', 'uasbg', NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, 0, '2026-03-01 10:13:43');

SET FOREIGN_KEY_CHECKS=1;
