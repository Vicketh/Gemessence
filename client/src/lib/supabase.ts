import { createClient } from "@supabase/supabase-js";

// These are set as Vite env vars (VITE_ prefix = exposed to browser)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase env vars not set — running in offline/demo mode");
}

export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder"
);

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export async function getProducts(filters?: {
  category?: string;
  featured?: boolean;
  search?: string;
}) {
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.featured) query = query.eq("featured", true);
  if (filters?.search) query = query.ilike("name", `%${filters.search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getProduct(id: number) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createProduct(product: any) {
  const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const { data, error } = await supabase.from("products").insert({ ...product, slug }).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: number, product: any) {
  const { data, error } = await supabase.from("products").update({ ...product, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: number) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
export async function getSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("app_settings").select("key, value");
  if (error) return {};
  return Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]));
}

export async function updateSetting(key: string, value: string) {
  const { error } = await supabase.from("app_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}

export async function updateSettings(data: Record<string, string>) {
  const rows = Object.entries(data).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
  const { error } = await supabase.from("app_settings").upsert(rows, { onConflict: "key" });
  if (error) throw error;
  return getSettings();
}

// ─── HERO SLIDES ─────────────────────────────────────────────────────────────
export async function getHeroSlides() {
  const { data, error } = await supabase.from("hero_slides").select("*").order("position", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function upsertHeroSlide(slide: any) {
  const { data, error } = await supabase.from("hero_slides").upsert(slide, { onConflict: "id" }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteHeroSlide(id: number) {
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) throw error;
}

// ─── USERS / AUTH ─────────────────────────────────────────────────────────────
export async function getUsers() {
  const { data, error } = await supabase.from("users").select("id, username, email, is_admin, is_super_user, is_verified, created_at").order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function loginUser(username: string, password: string) {
  const { data, error } = await supabase.from("users").select("*").or(`username.eq.${username},email.eq.${username}`).eq("password", password).single();
  if (error || !data) throw new Error("Invalid credentials");
  return data;
}

export async function registerUser(username: string, email: string, password: string) {
  const { data, error } = await supabase.from("users").insert({ username, email, password, is_verified: false, is_admin: false, is_super_user: false }).select().single();
  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: number, isAdmin: boolean) {
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
  const orderNumber = `GEM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const { data, error } = await supabase.from("orders").insert({ ...order, order_number: orderNumber, status: "pending", payment_status: "pending" }).select().single();
  if (error) throw error;
  return data;
}

export async function getOrders(userId: number) {
  const { data, error } = await supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getOrder(id: number) {
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}
