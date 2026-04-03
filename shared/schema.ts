import {
  pgTable,
  text,
  serial,
  boolean,
  timestamp,
  numeric,
  integer,
  jsonb,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// USERS TABLE
// ============================================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isVerified: boolean("is_verified").default(false),
  isAdmin: boolean("is_admin").default(false),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  county: text("county"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// CATEGORIES TABLE
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const categories: any = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  parentId: integer("parent_id").references((): AnyPgColumn => categories.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// PRODUCTS TABLE - Enhanced for Jewelry
// ============================================
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  categoryId: integer("category_id").references(() => categories.id),
  category: text("category").notNull(),
  featured: boolean("featured").default(false),
  inStock: boolean("in_stock").default(true),
  stockQuantity: integer("stock_quantity").default(0),
  sku: text("sku").unique(),
  // Jewelry-specific fields
  metalType: text("metal_type"), // 18k Gold, White Gold, Platinum, Silver
  metalColor: text("metal_color"), // Yellow, White, Rose
  gemstoneType: text("gemstone_type"), // Diamond, Ruby, Sapphire, Emerald, etc.
  gemstoneWeight: numeric("gemstone_weight", { precision: 5, scale: 2 }), // in carats
  ringSizes: jsonb("ring_sizes").$type<string[]>().default([]), // Available ring sizes
  chainLength: text("chain_length"), // For necklaces
  weight: numeric("weight", { precision: 6, scale: 2 }), // Product weight in grams
  dimensions: jsonb("dimensions").$type<{
    length: number;
    width: number;
    height: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// PRODUCT REVIEWS TABLE
// ============================================
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  rating: integer("rating").notNull(),
  title: text("title"),
  comment: text("comment"),
  images: jsonb("images").$type<string[]>().default([]),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// SHOPPING CART TABLE
// ============================================
export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"), // For guest users
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// CART ITEMS TABLE
// ============================================
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .notNull()
    .references(() => cart.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  // Selected options for jewelry
  ringSize: text("ring_size"),
  metalType: text("metal_type"),
  metalColor: text("metal_color"),
  chainLength: text("chain_length"),
  engraving: text("engraving"), // Custom engraving text
  giftWrap: boolean("gift_wrap").default(false),
  priceAtAdd: numeric("price_at_add", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// WISHLIST TABLE
// ============================================
export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// ORDERS TABLE
// ============================================
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled, refunded
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).default(
    "0",
  ),
  tax: numeric("tax", { precision: 10, scale: 2 }).default("0"),
  discount: numeric("discount", { precision: 10, scale: 2 }).default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("KES"), // KES or USD
  // Payment info
  paymentMethod: text("payment_method").default("mpesa"), // mpesa, card, bank_transfer
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed, refunded
  mpesaReceiptNumber: text("mpesa_receipt_number"),
  mpesaPhoneNumber: text("mpesa_phone_number"),
  // Shipping info
  shippingFirstName: text("shipping_first_name"),
  shippingLastName: text("shipping_last_name"),
  shippingPhone: text("shipping_phone"),
  shippingEmail: text("shipping_email"),
  shippingAddress: text("shipping_address"),
  shippingCity: text("shipping_city"),
  shippingCounty: text("shipping_county"), // Kenyan counties
  shippingPostalCode: text("shipping_postal_code"),
  shippingInstructions: text("shipping_instructions"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// ORDER ITEMS TABLE
// ============================================
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  productName: text("product_name").notNull(),
  productImageUrl: text("product_image_url"),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  // Selected options at time of purchase
  ringSize: text("ring_size"),
  metalType: text("metal_type"),
  metalColor: text("metal_color"),
  chainLength: text("chain_length"),
  engraving: text("engraving"),
  giftWrap: boolean("gift_wrap").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// SHIPPING ZONES TABLE (Kenya Counties)
// ============================================
export const shippingZones = pgTable("shipping_zones", {
  id: serial("id").primaryKey(),
  county: text("county").notNull().unique(),
  cost: numeric("cost", { precision: 10, scale: 2 }).notNull(),
  estimatedDays: integer("estimated_days").default(3),
});

// ============================================
// INSERT SCHEMAS (for creating records)
// ============================================
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  phone: true,
  address: true,
  city: true,
  county: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  isVerifiedPurchase: true,
  createdAt: true,
});

export const insertCartSchema = createInsertSchema(cart).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  priceAtAdd: true,
  createdAt: true,
});

export const insertWishlistSchema = createInsertSchema(wishlist).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertShippingZoneSchema = createInsertSchema(shippingZones).omit({
  id: true,
});

// ============================================
// SELECT SCHEMAS (for reading records)
// ============================================
export const selectUserSchema = createSelectSchema(users);
export const selectCategorySchema = createSelectSchema(categories);
export const selectProductSchema = createSelectSchema(products);
export const selectReviewSchema = createSelectSchema(reviews);
export const selectCartSchema = createSelectSchema(cart);
export const selectCartItemSchema = createSelectSchema(cartItems);
export const selectWishlistSchema = createSelectSchema(wishlist);
export const selectOrderSchema = createSelectSchema(orders);
export const selectOrderItemSchema = createSelectSchema(orderItems);
export const selectShippingZoneSchema = createSelectSchema(shippingZones);

// ============================================
// API TYPES
// ============================================
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Cart = typeof cart.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type Wishlist = typeof wishlist.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type ShippingZone = typeof shippingZones.$inferSelect;

// ============================================
// REQUEST/RESPONSE TYPES
// ============================================
export type UserResponse = Omit<User, "password">;
export type RegisterRequest = InsertUser;
export type LoginRequest = Pick<InsertUser, "username" | "password">;
export type UpdateUserRequest = Partial<InsertUser>;

export type ProductWithCategory = Product & {
  categoryData?: Category;
  averageRating?: number;
  reviewCount?: number;
};

export type CartWithItems = Cart & {
  items: (CartItem & { product: Product })[];
  subtotal: number;
  totalItems: number;
};

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export type CheckoutRequest = {
  shippingFirstName: string;
  shippingLastName: string;
  shippingPhone: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCounty: string;
  shippingPostalCode?: string;
  shippingInstructions?: string;
  paymentMethod: "mpesa" | "card" | "bank_transfer";
  mpesaPhoneNumber?: string;
  saveAddress?: boolean;
};

export type MpesaPaymentRequest = {
  phoneNumber: string;
  amount: number;
  orderId: number;
};

export type MpesaPaymentResponse = {
  success: boolean;
  checkoutId?: string;
  message?: string;
};

// Kenyan counties for shipping
export const KENYAN_COUNTIES = [
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita-Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans-Nzoia",
  "Uasin Gishu",
  "Elgeyo-Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
  "Nairobi",
] as const;

// Jewelry metal types
export const METAL_TYPES = [
  "18k Gold",
  "14k Gold",
  "White Gold",
  "Rose Gold",
  "Platinum",
  "Sterling Silver",
] as const;
export const METAL_COLORS = ["Yellow", "White", "Rose"] as const;
export const GEMSTONE_TYPES = [
  "Diamond",
  "Ruby",
  "Sapphire",
  "Emerald",
  "Pearl",
  "Aquamarine",
  "Topaz",
  "Amethyst",
  "Garnet",
  "Opal",
  "None",
] as const;
export const RING_SIZES = [
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
] as const;
export const CHAIN_LENGTHS = [
  "16 inches",
  "18 inches",
  "20 inches",
  "22 inches",
  "24 inches",
  "30 inches",
] as const;
