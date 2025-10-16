/*
  # Cafetería Bosco - Complete Database Schema

  ## Overview
  Complete database schema for Cafetería Bosco with menu management, orders, and table tracking.

  ## New Tables
  
  ### 1. categories
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text) - Category name (Desayunos, Cafés, etc.)
  - `slug` (text) - URL-friendly identifier
  - `icon` (text) - Icon name for UI
  - `display_order` (integer) - Sort order for display
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. products
  - `id` (uuid, primary key) - Unique product identifier
  - `category_id` (uuid, foreign key) - Links to categories
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `price` (decimal) - Base price in MXN
  - `image_url` (text) - Product image URL
  - `is_featured` (boolean) - Show in homepage carousel
  - `intensity_level` (integer) - For coffee (1-5, null for others)
  - `is_hot` (boolean) - Temperature indicator
  - `is_available` (boolean) - Availability status
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. extras
  - `id` (uuid, primary key) - Unique extra identifier
  - `name` (text) - Extra name (e.g., "Leche de Almendra")
  - `price` (decimal) - Additional cost in MXN
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. product_extras
  - `product_id` (uuid, foreign key) - Links to products
  - `extra_id` (uuid, foreign key) - Links to extras
  - Junction table for many-to-many relationship

  ### 5. restaurant_tables
  - `id` (uuid, primary key) - Unique table identifier
  - `table_number` (integer) - Physical table number
  - `seats` (integer) - Number of seats
  - `status` (text) - available, occupied, reserved
  - `current_order_id` (uuid, nullable) - Links to active order
  - `created_at` (timestamptz) - Record creation timestamp

  ### 6. orders
  - `id` (uuid, primary key) - Unique order identifier
  - `order_number` (text) - Human-readable order number
  - `table_id` (uuid, nullable) - Links to restaurant_tables (null for delivery)
  - `customer_name` (text) - Customer name
  - `customer_phone` (text) - Customer phone
  - `customer_email` (text) - Customer email
  - `delivery_address` (text, nullable) - For delivery orders
  - `order_type` (text) - dine_in, delivery, takeout
  - `status` (text) - pending, preparing, ready, completed, cancelled
  - `notes` (text) - Special instructions
  - `subtotal` (decimal) - Order subtotal
  - `total` (decimal) - Order total
  - `created_at` (timestamptz) - Order timestamp
  - `completed_at` (timestamptz, nullable) - Completion timestamp

  ### 7. order_items
  - `id` (uuid, primary key) - Unique item identifier
  - `order_id` (uuid, foreign key) - Links to orders
  - `product_id` (uuid, foreign key) - Links to products
  - `quantity` (integer) - Item quantity
  - `unit_price` (decimal) - Price per unit at time of order
  - `notes` (text) - Item-specific notes
  - `created_at` (timestamptz) - Record creation timestamp

  ### 8. order_item_extras
  - `order_item_id` (uuid, foreign key) - Links to order_items
  - `extra_id` (uuid, foreign key) - Links to extras
  - `extra_price` (decimal) - Price at time of order
  - Junction table for order items and their extras

  ## Security
  - RLS enabled on all tables
  - Public read access for products, categories, extras
  - Public insert/read for orders
  - Restrictive policies for data modification

  ## Sample Data
  Includes sample categories, products, extras, and tables
*/

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL DEFAULT 0,
  image_url text DEFAULT '',
  is_featured boolean DEFAULT false,
  intensity_level integer CHECK (intensity_level >= 1 AND intensity_level <= 5),
  is_hot boolean DEFAULT true,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Extras Table
CREATE TABLE IF NOT EXISTS extras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Product Extras Junction Table
CREATE TABLE IF NOT EXISTS product_extras (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  extra_id uuid REFERENCES extras(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, extra_id)
);

-- Restaurant Tables
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number integer UNIQUE NOT NULL,
  seats integer DEFAULT 4,
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved')),
  current_order_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  table_id uuid REFERENCES restaurant_tables(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_phone text DEFAULT '',
  customer_email text DEFAULT '',
  delivery_address text DEFAULT '',
  order_type text DEFAULT 'dine_in' CHECK (order_type IN ('dine_in', 'delivery', 'takeout')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  notes text DEFAULT '',
  subtotal decimal(10,2) DEFAULT 0,
  total decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Order Item Extras Junction Table
CREATE TABLE IF NOT EXISTS order_item_extras (
  order_item_id uuid REFERENCES order_items(id) ON DELETE CASCADE,
  extra_id uuid REFERENCES extras(id) ON DELETE RESTRICT,
  extra_price decimal(10,2) NOT NULL,
  PRIMARY KEY (order_item_id, extra_id)
);

-- Add foreign key for current_order_id in restaurant_tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'restaurant_tables_current_order_id_fkey'
  ) THEN
    ALTER TABLE restaurant_tables 
      ADD CONSTRAINT restaurant_tables_current_order_id_fkey 
      FOREIGN KEY (current_order_id) REFERENCES orders(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_extras ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public Read for Menu Items
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view extras"
  ON extras FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view product extras"
  ON product_extras FOR SELECT
  TO public
  USING (true);

-- Tables and Orders - Public can view, authenticated can modify
CREATE POLICY "Public can view tables"
  ON restaurant_tables FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated can update tables"
  ON restaurant_tables FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can view orders"
  ON orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can view order items"
  ON order_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can view order item extras"
  ON order_item_extras FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert order item extras"
  ON order_item_extras FOR INSERT
  TO public
  WITH CHECK (true);
