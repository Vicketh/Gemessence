import { db } from "./db";
import {
  users,
  products,
  categories,
  cart,
  cartItems,
  wishlist,
  orders,
  orderItems,
  reviews,
  shippingZones,
  appSettings,
  adminRoles,
  adminPermissions,
  rolePermissions,
  productDiscounts,
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Cart,
  type CartItem,
  type InsertCartItem,
  type Wishlist,
  type Order,
  type InsertOrder,
  type OrderItem,
  type Review,
  type InsertReview,
  type ShippingZone,
  type AdminRole,
  type AdminPermission,
  type ProductDiscount,
  type ProductWithCategory,
  type CartWithItems,
  type OrderWithItems,
  type CheckoutRequest,
} from "@shared/schema";
import { eq, and, desc, asc, sql, count, avg } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(
    id: number,
    data: Partial<Category>,
  ): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<void>;

  // Products
  getProducts(filters?: {
    category?: string;
    metalType?: string;
    gemstoneType?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    inStock?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<ProductWithCategory[]>;
  getProduct(id: number): Promise<ProductWithCategory | undefined>;
  getProductBySlug(slug: string): Promise<ProductWithCategory | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(
    id: number,
    data: Partial<Product>,
  ): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Cart
  getCart(userId?: number, sessionId?: string): Promise<CartWithItems | null>;
  createCart(userId?: number, sessionId?: string): Promise<Cart>;
  addToCart(
    cartId: number,
    productId: number,
    data: Omit<InsertCartItem, "cartId" | "priceAtAdd">,
  ): Promise<CartItem>;
  updateCartItem(
    cartItemId: number,
    data: Partial<CartItem>,
  ): Promise<CartItem | undefined>;
  removeCartItem(cartItemId: number): Promise<void>;
  clearCart(cartId: number): Promise<void>;

  // Wishlist
  getWishlist(userId: number): Promise<(Wishlist & { product: Product })[]>;
  addToWishlist(userId: number, productId: number): Promise<Wishlist>;
  removeFromWishlist(userId: number, productId: number): Promise<void>;
  isInWishlist(userId: number, productId: number): Promise<boolean>;

  // Orders
  getOrders(userId: number): Promise<OrderWithItems[]>;
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  getOrderByOrderNumber(
    orderNumber: string,
  ): Promise<OrderWithItems | undefined>;
  createOrder(data: {
    userId: number;
    items: Array<{
      productId: number;
      quantity: number;
      unitPrice: number;
      ringSize?: string | null;
      metalType?: string | null;
      metalColor?: string | null;
      chainLength?: string | null;
      engraving?: string | null;
      giftWrap?: boolean;
    }>;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
    paymentMethod: string;
    shippingInfo: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      county: string;
      postalCode?: string;
      instructions?: string;
    };
  }): Promise<Order>;
  updateOrder(id: number, data: Partial<Order>): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  updatePaymentStatus(
    id: number,
    status: string,
    mpesaReceiptNumber?: string,
  ): Promise<Order | undefined>;

  // Shipping Zones
  getShippingZones(): Promise<ShippingZone[]>;
  getShippingCost(county: string): Promise<number>;

  // Settings
  getSettings(): Promise<Record<string, string>>;
  updateSettings(data: Record<string, string>): Promise<Record<string, string>>;
  getAdmins(): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  // ==================== USERS ====================
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // ==================== CATEGORIES ====================
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await db
      .insert(categories)
      .values(insertCategory)
      .returning() as unknown as Category[];
    return result[0];
  }

  async updateCategory(
    id: number,
    data: Partial<Category>,
  ): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // ==================== PRODUCTS ====================
  async getProducts(filters?: {
    category?: string;
    metalType?: string;
    gemstoneType?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    inStock?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<ProductWithCategory[]> {
    const baseQuery = db
      .select({
        product: products,
        category: categories,
        averageRating: avg(reviews.rating),
        reviewCount: count(reviews.id),
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(reviews, eq(products.id, reviews.productId));

    const conditions = [];

    if (filters?.category) {
      conditions.push(eq(products.category, filters.category));
    }

    if (filters?.metalType) {
      conditions.push(eq(products.metalType, filters.metalType));
    }

    if (filters?.gemstoneType) {
      conditions.push(eq(products.gemstoneType, filters.gemstoneType));
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(sql`${products.price} >= ${filters.minPrice}`);
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(sql`${products.price} <= ${filters.maxPrice}`);
    }

    if (filters?.featured !== undefined) {
      conditions.push(eq(products.featured, filters.featured));
    }

    if (filters?.inStock !== undefined) {
      conditions.push(eq(products.inStock, filters.inStock));
    }

    if (filters?.search) {
      conditions.push(
        sql`${products.name} ILIKE ${`%${filters.search}%`} OR ${products.description} ILIKE ${`%${filters.search}%`}`,
      );
    }

    const withWhere = conditions.length > 0
      ? baseQuery.where(and(...conditions))
      : baseQuery;

    const withGroup = withWhere.groupBy(products.id, categories.id);

    const order = filters?.sortOrder === "desc" ? desc : asc;
    let withOrder;
    switch (filters?.sortBy) {
      case "price":
        withOrder = withGroup.orderBy(order(products.price));
        break;
      case "name":
        withOrder = withGroup.orderBy(order(products.name));
        break;
      case "rating":
        withOrder = withGroup.orderBy(order(sql`${avg(reviews.rating)}`));
        break;
      case "newest":
        withOrder = withGroup.orderBy(desc(products.createdAt));
        break;
      default:
        withOrder = withGroup.orderBy(desc(products.featured), desc(products.createdAt));
    }

    const withLimit = filters?.limit ? withOrder.limit(filters.limit) : withOrder;
    const withOffset = filters?.offset ? withLimit.offset(filters.offset) : withLimit;

    const results = await withOffset;

    return results.map((r) => ({
      ...r.product,
      categoryData: r.category || undefined,
      averageRating: r.averageRating ? parseFloat(r.averageRating) : 0,
      reviewCount: r.reviewCount ? Number(r.reviewCount) : 0,
    }));
  }

  async getProduct(id: number): Promise<ProductWithCategory | undefined> {
    const results = await db
      .select({
        product: products,
        category: categories,
        averageRating: avg(reviews.rating),
        reviewCount: count(reviews.id),
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(reviews, eq(products.id, reviews.productId))
      .where(eq(products.id, id))
      .groupBy(products.id, categories.id);

    const result = results[0];
    if (!result) return undefined;

    return {
      ...result.product,
      categoryData: result.category || undefined,
      averageRating: result.averageRating
        ? parseFloat(result.averageRating)
        : 0,
      reviewCount: result.reviewCount ? Number(result.reviewCount) : 0,
    };
  }

  async getProductBySlug(
    slug: string,
  ): Promise<ProductWithCategory | undefined> {
    const results = await db
      .select({
        product: products,
        category: categories,
        averageRating: avg(reviews.rating),
        reviewCount: count(reviews.id),
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(reviews, eq(products.id, reviews.productId))
      .where(eq(products.slug, slug))
      .groupBy(products.id, categories.id);

    const result = results[0];
    if (!result) return undefined;

    return {
      ...result.product,
      categoryData: result.category || undefined,
      averageRating: result.averageRating
        ? parseFloat(result.averageRating)
        : 0,
      reviewCount: result.reviewCount ? Number(result.reviewCount) : 0,
    };
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const slug = (insertProduct as any).slug ||
      (insertProduct.name as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const [product] = await db
      .insert(products)
      .values({ ...insertProduct, slug } as any)
      .returning();
    return product;
  }

  async updateProduct(
    id: number,
    data: Partial<Product>,
  ): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  // ==================== CART ====================
  async getCart(
    userId?: number,
    sessionId?: string,
  ): Promise<CartWithItems | null> {
    const conditions = [];
    if (userId) conditions.push(eq(cart.userId, userId));
    if (sessionId) conditions.push(eq(cart.sessionId, sessionId));

    if (conditions.length === 0) return null;

    const [cartRecord] = await db
      .select()
      .from(cart)
      .where(and(...conditions))
      .orderBy(desc(cart.updatedAt))
      .limit(1);

    if (!cartRecord) return null;

    const items = await db
      .select({
        cartItem: cartItems,
        product: products,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cartRecord.id));

    const subtotal = items.reduce((sum, item) => {
      return (
        sum + parseFloat(item.cartItem.priceAtAdd) * item.cartItem.quantity
      );
    }, 0);

    const totalItems = items.reduce(
      (sum, item) => sum + item.cartItem.quantity,
      0,
    );

    return {
      ...cartRecord,
      items: items.map((item) => ({
        ...item.cartItem,
        product: item.product!,
      })),
      subtotal,
      totalItems,
    };
  }

  async createCart(userId?: number, sessionId?: string): Promise<Cart> {
    const [cartRecord] = await db
      .insert(cart)
      .values({ userId, sessionId })
      .returning();
    return cartRecord;
  }

  async addToCart(
    cartId: number,
    productId: number,
    data: Omit<InsertCartItem, "cartId" | "priceAtAdd">,
  ): Promise<CartItem> {
    // Get product price
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));
    if (!product) throw new Error("Product not found");

    // Check if item already exists with same options
    const conditions = [
      eq(cartItems.cartId, cartId),
      eq(cartItems.productId, productId),
    ];

    if (data.ringSize) conditions.push(eq(cartItems.ringSize, data.ringSize));
    if (data.metalType)
      conditions.push(eq(cartItems.metalType, data.metalType));
    if (data.metalColor)
      conditions.push(eq(cartItems.metalColor, data.metalColor));
    if (data.chainLength)
      conditions.push(eq(cartItems.chainLength, data.chainLength));
    if (data.engraving)
      conditions.push(eq(cartItems.engraving, data.engraving));

    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(and(...conditions));

    if (existingItem) {
      // Update quantity
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + (data.quantity || 1) })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updated;
    }

    // Create new item
    const [cartItem] = await db
      .insert(cartItems)
      .values({
        ...data,
        cartId,
        productId,
        priceAtAdd: product.price,
      })
      .returning();

    // Update cart timestamp
    await db
      .update(cart)
      .set({ updatedAt: new Date() })
      .where(eq(cart.id, cartId));

    return cartItem;
  }

  async updateCartItem(
    cartItemId: number,
    data: Partial<CartItem>,
  ): Promise<CartItem | undefined> {
    const [item] = await db
      .update(cartItems)
      .set(data)
      .where(eq(cartItems.id, cartItemId))
      .returning();
    return item;
  }

  async removeCartItem(cartItemId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  }

  async clearCart(cartId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    await db.delete(cart).where(eq(cart.id, cartId));
  }

  // ==================== WISHLIST ====================
  async getWishlist(
    userId: number,
  ): Promise<(Wishlist & { product: Product })[]> {
    const results = await db
      .select({
        wishlist: wishlist,
        product: products,
      })
      .from(wishlist)
      .leftJoin(products, eq(wishlist.productId, products.id))
      .where(eq(wishlist.userId, userId));

    return results
      .filter((r) => r.product !== null)
      .map((r) => ({ ...r.wishlist, product: r.product! }));
  }

  async addToWishlist(userId: number, productId: number): Promise<Wishlist> {
    // Check if already in wishlist
    const [existing] = await db
      .select()
      .from(wishlist)
      .where(
        and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)),
      );

    if (existing) return existing;

    const [wishlistItem] = await db
      .insert(wishlist)
      .values({ userId, productId })
      .returning();
    return wishlistItem;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    await db
      .delete(wishlist)
      .where(
        and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)),
      );
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const [item] = await db
      .select()
      .from(wishlist)
      .where(
        and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)),
      );
    return !!item;
  }

  // ==================== ORDERS ====================
  async getOrders(userId: number): Promise<OrderWithItems[]> {
    const ordersList = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      ordersList.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        return { ...order, items };
      }),
    );

    return ordersWithItems;
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));
    return { ...order, items };
  }

  async getOrderByOrderNumber(
    orderNumber: string,
  ): Promise<OrderWithItems | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber));
    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));
    return { ...order, items };
  }

  async createOrder(data: {
    userId: number;
    items: Array<{
      productId: number;
      quantity: number;
      unitPrice: number;
      ringSize?: string | null;
      metalType?: string | null;
      metalColor?: string | null;
      chainLength?: string | null;
      engraving?: string | null;
      giftWrap?: boolean;
    }>;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
    currency: string;
    paymentMethod: string;
    shippingInfo: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      county: string;
      postalCode?: string;
      instructions?: string;
    };
  }): Promise<Order> {
    // Generate order number
    const orderNumber = `GEM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create order
    const [order] = await db
      .insert(orders)
      .values({
        userId: data.userId,
        orderNumber,
        status: "pending",
        subtotal: data.subtotal.toString(),
        shippingCost: data.shippingCost.toString(),
        tax: data.tax.toString(),
        discount: data.discount.toString(),
        total: data.total.toString(),
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        paymentStatus: "pending",
        shippingFirstName: data.shippingInfo.firstName,
        shippingLastName: data.shippingInfo.lastName,
        shippingPhone: data.shippingInfo.phone,
        shippingEmail: data.shippingInfo.email,
        shippingAddress: data.shippingInfo.address,
        shippingCity: data.shippingInfo.city,
        shippingCounty: data.shippingInfo.county,
        shippingPostalCode: data.shippingInfo.postalCode,
        shippingInstructions: data.shippingInfo.instructions,
      })
      .returning();

    // Create order items
    for (const item of data.items) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        productName:
          (
            await db
              .select({ name: products.name })
              .from(products)
              .where(eq(products.id, item.productId))
          )[0]?.name || "Unknown",
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        total: (item.unitPrice * item.quantity).toString(),
        ringSize: item.ringSize || null,
        metalType: item.metalType || null,
        metalColor: item.metalColor || null,
        chainLength: item.chainLength || null,
        engraving: item.engraving || null,
        giftWrap: item.giftWrap || false,
      });
    }

    return order;
  }

  async updateOrder(
    id: number,
    data: Partial<Order>,
  ): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async updateOrderStatus(
    id: number,
    status: string,
  ): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async updatePaymentStatus(
    id: number,
    status: string,
    mpesaReceiptNumber?: string,
  ): Promise<Order | undefined> {
    const updateData: Partial<Order> = {
      paymentStatus: status,
      updatedAt: new Date(),
    };
    if (mpesaReceiptNumber) {
      updateData.mpesaReceiptNumber = mpesaReceiptNumber;
    }

    const [order] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // ==================== SHIPPING ZONES ====================
  async getShippingZones(): Promise<ShippingZone[]> {
    return await db
      .select()
      .from(shippingZones)
      .orderBy(asc(shippingZones.county));
  }

  async getShippingCost(county: string): Promise<number> {
    const [zone] = await db
      .select()
      .from(shippingZones)
      .where(eq(shippingZones.county, county));
    return zone ? parseFloat(zone.cost) : 500;
  }

  // ==================== SETTINGS ====================
  async getSettings(): Promise<Record<string, string>> {
    const rows = await db.select().from(appSettings);
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async updateSettings(data: Record<string, string>): Promise<Record<string, string>> {
    for (const [key, value] of Object.entries(data)) {
      const existing = await db.select().from(appSettings).where(eq(appSettings.key, key));
      if (existing.length > 0) {
        await db.update(appSettings).set({ value, updatedAt: new Date() }).where(eq(appSettings.key, key));
      } else {
        await db.insert(appSettings).values({ key, value });
      }
    }
    return this.getSettings();
  }

  async getAdmins(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isAdmin, true));
  }

  // ============================================
  // ADMIN ROLES & PERMISSIONS
  // ============================================
  async getAdminRoles() {
    const { adminRoles, rolePermissions, adminPermissions } = await import("@shared/schema");
    return await db.select().from(adminRoles);
  }

  async createAdminRole(name: string, description?: string) {
    const { adminRoles } = await import("@shared/schema");
    const [role] = await db.insert(adminRoles).values({ name, description }).returning();
    return role;
  }

  async addPermissionToRole(roleId: number, permissionId: number) {
    const { rolePermissions } = await import("@shared/schema");
    const [mapping] = await db.insert(rolePermissions).values({ roleId, permissionId }).returning();
    return mapping;
  }

  async removePermissionFromRole(roleId: number, permissionId: number) {
    const { rolePermissions } = await import("@shared/schema");
    await db.delete(rolePermissions).where(
      and(
        eq(rolePermissions.roleId, roleId),
        eq(rolePermissions.permissionId, permissionId)
      )
    );
  }

  async getPermissions() {
    const { adminPermissions } = await import("@shared/schema");
    return await db.select().from(adminPermissions);
  }

  async createPermission(name: string, description?: string, category?: string) {
    const { adminPermissions } = await import("@shared/schema");
    const [permission] = await db.insert(adminPermissions).values({ name, description, category }).returning();
    return permission;
  }

  async getRolePermissions(roleId: number) {
    const { rolePermissions, adminPermissions } = await import("@shared/schema");
    return await db
      .select({ permission: adminPermissions })
      .from(rolePermissions)
      .innerJoin(adminPermissions, eq(rolePermissions.permissionId, adminPermissions.id))
      .where(eq(rolePermissions.roleId, roleId));
  }

  // ============================================
  // PRODUCT DISCOUNTS
  // ============================================
  async createProductDiscount(data: {
    productId: number;
    discountType: 'percentage' | 'fixed';
    discountValue: string;
    startDate: Date;
    endDate: Date;
    createdBy: number;
  }) {
    const { productDiscounts } = await import("@shared/schema");
    const [discount] = await db.insert(productDiscounts).values({
      productId: data.productId,
      discountType: data.discountType,
      discountValue: data.discountValue,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: true,
      createdBy: data.createdBy,
    }).returning();
    return discount;
  }

  async getProductDiscount(productId: number) {
    const { productDiscounts } = await import("@shared/schema");
    const now = new Date();
    const [discount] = await db
      .select()
      .from(productDiscounts)
      .where(
        and(
          eq(productDiscounts.productId, productId),
          eq(productDiscounts.isActive, true),
          sql`${productDiscounts.startDate} <= ${now}`,
          sql`${productDiscounts.endDate} >= ${now}`
        )
      )
      .limit(1);
    return discount;
  }

  async getActiveDiscounts() {
    const { productDiscounts } = await import("@shared/schema");
    const now = new Date();
    return await db
      .select()
      .from(productDiscounts)
      .where(
        and(
          eq(productDiscounts.isActive, true),
          sql`${productDiscounts.startDate} <= ${now}`,
          sql`${productDiscounts.endDate} >= ${now}`
        )
      );
  }

  async updateDiscount(id: number, data: Partial<any>) {
    const { productDiscounts } = await import("@shared/schema");
    const [discount] = await db
      .update(productDiscounts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(productDiscounts.id, id))
      .returning();
    return discount;
  }

  async deactivateDiscount(id: number) {
    return await this.updateDiscount(id, { isActive: false });
  }

  async deleteDiscount(id: number) {
    const { productDiscounts } = await import("@shared/schema");
    await db.delete(productDiscounts).where(eq(productDiscounts.id, id));
  }
}

export const storage = new DatabaseStorage();
