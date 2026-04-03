-- ============================================================
-- GEMESSENCE SUPABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- USERS
create table if not exists users (
  id bigserial primary key,
  username text not null unique,
  email text not null unique,
  password text not null,
  is_verified boolean default false,
  is_admin boolean default false,
  is_super_user boolean default false,
  phone text,
  address text,
  city text,
  county text,
  created_at timestamptz default now()
);

-- APP SETTINGS (key-value store)
create table if not exists app_settings (
  id bigserial primary key,
  key text not null unique,
  value text not null,
  updated_at timestamptz default now()
);

-- HERO SLIDES
create table if not exists hero_slides (
  id bigserial primary key,
  src text not null,
  type text not null default 'image',  -- 'image' or 'video'
  title text,
  subtitle text,
  position integer default 0,
  created_at timestamptz default now()
);

-- CATEGORIES
create table if not exists categories (
  id bigserial primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  parent_id bigint references categories(id),
  created_at timestamptz default now()
);

-- PRODUCTS
create table if not exists products (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  description text not null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  image_url text not null,
  images jsonb default '[]',
  category_id bigint references categories(id),
  category text not null,
  featured boolean default false,
  in_stock boolean default true,
  stock_quantity integer default 0,
  sku text unique,
  metal_type text,
  metal_color text,
  gemstone_type text,
  gemstone_weight numeric(5,2),
  ring_sizes jsonb default '[]',
  chain_length text,
  weight numeric(6,2),
  dimensions jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ORDERS
create table if not exists orders (
  id bigserial primary key,
  user_id bigint references users(id),
  order_number text not null unique,
  status text not null default 'pending',
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) default 0,
  tax numeric(10,2) default 0,
  discount numeric(10,2) default 0,
  total numeric(10,2) not null,
  currency text default 'KES',
  payment_method text default 'mpesa',
  payment_status text default 'pending',
  mpesa_receipt_number text,
  mpesa_phone_number text,
  shipping_first_name text,
  shipping_last_name text,
  shipping_phone text,
  shipping_email text,
  shipping_address text,
  shipping_city text,
  shipping_county text,
  shipping_postal_code text,
  shipping_instructions text,
  notes text,
  items jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- REVIEWS
create table if not exists reviews (
  id bigserial primary key,
  product_id bigint references products(id),
  user_id bigint references users(id),
  rating integer not null,
  title text,
  comment text,
  images jsonb default '[]',
  is_verified_purchase boolean default false,
  is_approved boolean default false,
  is_featured boolean default false,
  admin_response text,
  created_at timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
alter table products enable row level security;
alter table categories enable row level security;
alter table hero_slides enable row level security;
alter table app_settings enable row level security;
alter table users enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;

-- Public read for products, categories, hero slides, settings
create policy "Public read products" on products for select using (true);
create policy "Public read categories" on categories for select using (true);
create policy "Public read hero_slides" on hero_slides for select using (true);
create policy "Public read app_settings" on app_settings for select using (true);
create policy "Public read reviews" on reviews for select using (is_approved = true);

-- Allow all operations via anon key (for admin dashboard — tighten in production)
create policy "Anon insert products" on products for insert with check (true);
create policy "Anon update products" on products for update using (true);
create policy "Anon delete products" on products for delete using (true);
create policy "Anon insert hero_slides" on hero_slides for insert with check (true);
create policy "Anon update hero_slides" on hero_slides for update using (true);
create policy "Anon delete hero_slides" on hero_slides for delete using (true);
create policy "Anon upsert app_settings" on app_settings for all using (true) with check (true);
create policy "Anon insert categories" on categories for insert with check (true);
create policy "Anon update categories" on categories for update using (true);
create policy "Anon read users" on users for select using (true);
create policy "Anon insert users" on users for insert with check (true);
create policy "Anon update users" on users for update using (true);
create policy "Anon insert orders" on orders for insert with check (true);
create policy "Anon read orders" on orders for select using (true);
create policy "Anon insert reviews" on reviews for insert with check (true);
create policy "Anon update reviews" on reviews for update using (true);
create policy "Anon delete reviews" on reviews for delete using (true);

-- ─── SEED DATA ───────────────────────────────────────────────────────────────
-- Superuser
insert into users (username, email, password, is_admin, is_super_user, is_verified)
values ('superuser', 'superuser@gemessence.co.ke', 'GemSuper@2025!', true, true, true)
on conflict (username) do nothing;

-- Default settings
insert into app_settings (key, value) values
  ('whatsapp_number', '+254797534189'),
  ('whatsapp_message', 'Hello! I''m interested in your jewelry collection.'),
  ('store_name', 'Gemessence'),
  ('support_email', 'support@gemessence.co.ke'),
  ('support_phone', '+254797534189'),
  ('default_currency', 'KES')
on conflict (key) do nothing;

-- Categories
insert into categories (name, slug, description) values
  ('Rings', 'rings', 'Exquisite rings for every occasion'),
  ('Necklaces', 'necklaces', 'Stunning necklaces and pendants'),
  ('Earrings', 'earrings', 'Elegant earrings for all styles'),
  ('Bracelets', 'bracelets', 'Beautiful bracelets and bangles'),
  ('Engagement', 'engagement', 'Unforgettable engagement rings'),
  ('Wedding', 'wedding', 'Wedding bands and ceremony jewelry')
on conflict (slug) do nothing;
