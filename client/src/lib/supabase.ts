import { createClient } from "@supabase/supabase-js";
import { resolveImageUrl } from "@/lib/utils";
import { localProducts } from "@/data/products";

// These are set as Vite env vars (VITE_ prefix = exposed to browser)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase env vars not set — running in offline/demo mode");
}

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function normalizeProduct(product: any) {
  if (!product) return null;

  const images: string[] = Array.isArray(product.images)
    ? product.images
    : product.images
    ? [product.images]
    : [];

  return {
    ...product,
    imageUrl: resolveImageUrl(product.image_url ?? product.imageUrl) ?? undefined,
    images: images
      .map((img: string) => resolveImageUrl(img))
      .filter((img): img is string => Boolean(img)),
    compareAtPrice: product.compare_at_price ?? product.compareAtPrice,
    categoryId: product.category_id ?? product.categoryId,
    featured: product.featured ?? false,
    inStock: product.in_stock ?? product.inStock,
    stockQuantity: product.stock_quantity ?? product.stockQuantity,
    metalType: product.metal_type ?? product.metalType,
    metalColor: product.metal_color ?? product.metalColor,
    gemstoneType: product.gemstone_type ?? product.gemstoneType,
    gemstoneWeight: product.gemstone_weight ?? product.gemstoneWeight,
    ringSizes: product.ring_sizes ?? product.ringSizes,
    chainLength: product.chain_length ?? product.chainLength,
    createdAt: product.created_at ?? product.createdAt,
    updatedAt: product.updated_at ?? product.updatedAt,
  };
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export async function getProducts(filters?: {
  category?: string;
  featured?: boolean;
  search?: string;
}) {
  let products = [...localProducts];
  if (filters?.category) {
    products = products.filter((product) => product.category === filters.category);
  }
  if (filters?.featured) {
    products = products.filter((product) => product.featured === true);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search),
    );
  }
  return products.sort((a, b) => {
    if (a.featured === b.featured) {
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    }
    return Number(b.featured) - Number(a.featured);
  });
}

export async function getProduct(id: number) {
  const product = localProducts.find((item) => item.id === id);
  return normalizeProduct(product ?? null);
}

export async function createProduct(product: any) {
  if (!supabase) throw new Error("Supabase not configured");
  const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const { data, error } = await supabase.from("products").insert({ ...product, slug }).select().single();
  if (error) throw error;
  return normalizeProduct(data);
}

export async function updateProduct(id: number, product: any) {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.from("products").update({ ...product, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) throw error;
  return normalizeProduct(data);
}

export async function deleteProduct(id: number) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
export async function getSettings(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data, error } = await supabase.from("app_settings").select("key, value");
  if (error) return {};
  return Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]));
}

export async function updateSetting(key: string, value: string) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("app_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}

export async function updateSettings(data: Record<string, string>) {
  if (!supabase) throw new Error("Supabase not configured");
  const rows = Object.entries(data).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
  const { error } = await supabase.from("app_settings").upsert(rows, { onConflict: "key" });
  if (error) throw error;
  return getSettings();
}

// ─── HERO SLIDES ─────────────────────────────────────────────────────────────
export async function getHeroSlides() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("hero_slides").select("*").order("position", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function upsertHeroSlide(slide: any) {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.from("hero_slides").upsert(slide, { onConflict: "id" }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteHeroSlide(id: number) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) throw error;
}

// ─── USERS / AUTH ─────────────────────────────────────────────────────────────
export async function getUsers() {
  if (!supabase) return [];
  const { data, error } = await supabase.from("users").select("id, username, email, is_admin, is_super_user, is_verified, created_at").order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function loginUser(username: string, _password: string) {
  // NOTE: Password comparison must be done server-side (bcrypt).
  // This Supabase path only works if passwords are stored as plain text in the DB,
  // which should only be used for dev/demo. For production, route through the Express backend.
  if (!supabase) throw new Error("No backend configured. Set VITE_API_BASE_URL to point to your API server.");
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .or(`username.eq.${username},email.eq.${username}`)
    .single();
  if (error || !data) throw new Error("Invalid credentials");
  return data;
}

export async function registerUser(user: { username: string; fullName: string; email: string; phone: string; password: string }) {
  if (!supabase) throw new Error("No backend configured. Set VITE_API_BASE_URL to point to your API server.");
  const { data, error } = await supabase
    .from("users")
    .insert({
      username: user.username,
      full_name: user.fullName,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: "customer",
      is_verified: false,
      is_admin: false,
      is_super_user: false,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: number, isAdmin: boolean) {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("users").update({ is_admin: isAdmin }).eq("id", userId);
  if (error) throw error;
}

// ─── CART (localStorage-backed for static site) ───────────────────────────────
export function getLocalCart(): any[] {
  try { return JSON.parse(localStorage.getItem("gem_cart") || "[]"); } catch { return []; }
}
export function saveLocalCart(items: any[]) {
  localStorage.setItem("gem_cart", JSON.stringify(items));
}

// ─── WISHLIST (localStorage-backed) ──────────────────────────────────────────
export function getLocalWishlist(): number[] {
  try { return JSON.parse(localStorage.getItem("gem_wishlist") || "[]"); } catch { return []; }
}
export function saveLocalWishlist(ids: number[]) {
  localStorage.setItem("gem_wishlist", JSON.stringify(ids));
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export async function createOrder(order: any) {
  if (!supabase) throw new Error("Supabase not configured");
  const orderNumber = `GEM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const { data, error } = await supabase.from("orders").insert({ ...order, order_number: orderNumber, status: "pending", payment_status: "pending" }).select().single();
  if (error) throw error;
  return data;
}

export async function getOrders(userId: number) {
  if (!supabase) return [];
  const { data, error } = await supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getOrder(id: number) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}
