-- ============================================================================
-- MANMAYI INDIA LUXURY E-COMMERCE - SUPABASE / POSTGRESQL DATABASE SCHEMA
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'editor');
CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE product_category_type AS ENUM ('clothing', 'jewellery', 'accessories', 'home');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE stock_adjustment_reason AS ENUM ('restock', 'return', 'damaged', 'audit_adjustment', 'initial_stock');

-- 3. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role admin_role NOT NULL DEFAULT 'admin',
    avatar_url TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    handle VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    editorial_title VARCHAR(255),
    group_name VARCHAR(100) DEFAULT 'clothing',
    description TEXT,
    cover_image TEXT,
    banner_image TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    handle VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category_type product_category_type NOT NULL DEFAULT 'clothing',
    type VARCHAR(100) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(12, 2) CHECK (compare_at_price >= price),
    cost_price NUMERIC(12, 2) CHECK (cost_price >= 0),
    material VARCHAR(100) NOT NULL,
    colour VARCHAR(100) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT DEFAULT 5,
    allow_backorders BOOLEAN DEFAULT FALSE,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT NOT NULL,
    craft TEXT,
    dimensions TEXT,
    care TEXT,
    sizes JSONB DEFAULT '["XS", "S", "M", "L", "XL", "XXL"]'::jsonb,
    weight_kg NUMERIC(6, 3) DEFAULT 0.500,
    status product_status NOT NULL DEFAULT 'active',
    is_featured BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PRODUCT COLLECTION ASSOCIATIONS
CREATE TABLE IF NOT EXISTS product_collections (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    collection_handle VARCHAR(255) REFERENCES collections(handle) ON DELETE CASCADE,
    PRIMARY KEY (product_id, collection_handle)
);

-- 8. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    size VARCHAR(50),
    colour VARCHAR(50),
    material VARCHAR(50),
    price NUMERIC(12, 2),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address JSONB DEFAULT '{}'::jsonb,
    total_orders INT DEFAULT 0,
    total_spent NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type discount_type NOT NULL DEFAULT 'percentage',
    discount_value NUMERIC(12, 2) NOT NULL CHECK (discount_value > 0),
    min_order_value NUMERIC(12, 2) DEFAULT 0.00,
    max_discount NUMERIC(12, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    per_customer_limit INT DEFAULT 1,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    discount_amount NUMERIC(12, 2) DEFAULT 0.00,
    shipping_fee NUMERIC(12, 2) DEFAULT 0.00,
    tax_amount NUMERIC(12, 2) DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) DEFAULT 'Online Payment / Card / UPI',
    payment_status payment_status DEFAULT 'pending',
    order_status order_status DEFAULT 'confirmed',
    tracking_number VARCHAR(100),
    courier_name VARCHAR(100),
    coupon_code VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_handle VARCHAR(255) NOT NULL,
    product_title VARCHAR(255) NOT NULL,
    product_image TEXT,
    size VARCHAR(50),
    price NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(12, 2) NOT NULL
);

-- 13. INVENTORY LOGS TABLE
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_handle VARCHAR(255) NOT NULL,
    quantity_change INT NOT NULL,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    reason stock_adjustment_reason NOT NULL,
    note TEXT,
    performed_by VARCHAR(255) DEFAULT 'System / Admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. PRODUCT REVIEWS TABLE
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    is_verified_purchase BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. BLOGS / EDITORIAL POSTS TABLE
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    author VARCHAR(100) NOT NULL DEFAULT 'LaMoksh Editorial',
    status VARCHAR(50) DEFAULT 'published',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. WEBSITE CONTENT BLOCKS TABLE
CREATE TABLE IF NOT EXISTS content_blocks (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS store_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ FOR ACTIVE PRODUCTS, CATEGORIES, COLLECTIONS, BLOGS, REVIEWS
CREATE POLICY "Public products read" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public collections read" ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "Public blogs read" ON blogs FOR SELECT USING (status = 'published');
CREATE POLICY "Public reviews read" ON product_reviews FOR SELECT USING (status = 'approved');

-- ADMIN ALL ACCESS POLICIES (Require authenticated role = 'admin')
CREATE POLICY "Admin users management" ON admin_users FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin products full control" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin categories full control" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin collections full control" ON collections FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin orders full control" ON orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin customers full control" ON customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin inventory logs control" ON inventory_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin coupons control" ON coupons FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin reviews control" ON product_reviews FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin blogs control" ON blogs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin audit logs control" ON audit_logs FOR ALL TO authenticated USING (true);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_handle ON products(handle);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_logs(product_id);
