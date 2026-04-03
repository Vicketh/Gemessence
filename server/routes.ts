import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import crypto from "crypto";
import {
  KENYAN_COUNTIES,
  METAL_TYPES,
  GEMSTONE_TYPES,
  RING_SIZES,
  CHAIN_LENGTHS,
} from "@shared/schema";

// CSRF token generation and validation
function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function csrfProtection(req: Request, res: Response, next: NextFunction) {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) return next();

  const token = req.headers["x-csrf-token"] as string;
  const sessionToken = (req as any).session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  next();
}

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Seed function for categories and products
async function seedDatabase() {
  // Create admin user first
  const existingAdmin = await storage.getUserByUsername("admin");
  if (!existingAdmin) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error("ADMIN_PASSWORD environment variable must be set");
    }
    await storage.createUser({
      username: "admin",
      email: process.env.ADMIN_EMAIL || "admin@gemessence.co.ke",
      password: adminPassword,
      isAdmin: true,
    });
    console.log("Admin user created");
  }

  // Seed categories first
  const existingCategories = await storage.getCategories();
  if (existingCategories.length === 0) {
    const categories = [
      {
        name: "Rings",
        slug: "rings",
        description: "Exquisite rings for every occasion",
      },
      {
        name: "Necklaces",
        slug: "necklaces",
        description: "Stunning necklaces and pendants",
      },
      {
        name: "Earrings",
        slug: "earrings",
        description: "Elegant earrings for all styles",
      },
      {
        name: "Bracelets",
        slug: "bracelets",
        description: "Beautiful bracelets and bangles",
      },
      {
        name: "Engagement",
        slug: "engagement",
        description: "Unforgettable engagement rings",
      },
      {
        name: "Wedding",
        slug: "wedding",
        description: "Wedding bands and ceremony jewelry",
      },
    ];

    for (const cat of categories) {
      await storage.createCategory(cat);
    }
  }

  // Seed products
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    const products = [
      {
        name: "Diamond Solitaire Engagement Ring",
        slug: "diamond-solitaire-engagement-ring",
        description:
          "A timeless classic featuring a brilliant round-cut diamond set in 18k white gold. This solitaire engagement ring embodies elegance and sophistication.",
        price: "125000.00",
        compareAtPrice: "150000.00",
        imageUrl: "/assets/Product_card_1772877259308.png",
        images: ["/assets/Product_card_1772877259308.png"],
        category: "Engagement",
        categoryId: 1,
        featured: true,
        inStock: true,
        stockQuantity: 10,
        sku: "RING-DIA-001",
        metalType: "18k Gold",
        metalColor: "White",
        gemstoneType: "Diamond",
        gemstoneWeight: "1.00",
        ringSizes: ["5", "6", "7", "8", "9"],
        weight: "3.5",
      },
      {
        name: "Pearl Drop Earrings",
        slug: "pearl-drop-earrings",
        description:
          "Elegant freshwater pearl drop earrings set in sterling silver. Perfect for weddings and formal occasions.",
        price: "8500.00",
        imageUrl: "/assets/Product_card_1772877259308.png",
        images: ["/assets/Product_card_1772877259308.png"],
        category: "Earrings",
        featured: true,
        inStock: true,
        stockQuantity: 25,
        sku: "EAR-PRL-001",
        metalType: "Sterling Silver",
        metalColor: "White",
        gemstoneType: "Pearl",
      },
      {
        name: "Gold Chain Necklace 18k",
        slug: "gold-chain-necklace-18k",
        description:
          "Premium 18k yellow gold chain necklace with classic link design. A versatile piece for everyday elegance.",
        price: "85000.00",
        imageUrl: "/assets/Product_card_1772877259308.png",
        images: ["/assets/Product_card_1772877259308.png"],
        category: "Necklaces",
        featured: false,
        inStock: true,
        stockQuantity: 15,
        sku: "NECK-GLD-001",
        metalType: "18k Gold",
        metalColor: "Yellow",
        chainLength: "18 inches",
        weight: "12.5",
      },
      {
        name: "Ruby Tennis Bracelet",
        slug: "ruby-tennis-bracelet",
        description:
          "Stunning tennis bracelet featuring genuine rubies set in 14k white gold. A statement piece for special occasions.",
        price: "95000.00",
        compareAtPrice: "110000.00",
        imageUrl: "/assets/Product_card_1772877259308.png",
        images: ["/assets/Product_card_1772877259308.png"],
        category: "Bracelets",
        featured: true,
        inStock: true,
        stockQuantity: 8,
        sku: "BRAC-RUB-001",
        metalType: "14k Gold",
        metalColor: "White",
        gemstoneType: "Ruby",
        gemstoneWeight: "5.00",
        weight: "8.2",
      },
      {
        name: "Sapphire Halo Ring",
        slug: "sapphire-halo-ring",
        description:
          "Magnificent blue sapphire surrounded by a halo of diamonds, set in platinum. A royal-inspired design.",
        price: "175000.00",
        imageUrl: "/assets/Product_card_1772877259308.png",
        images: ["/assets/Product_card_1772877259308.png"],
        category: "Rings",
        featured: true,
        inStock: true,
        stockQuantity: 5,
        sku: "RING-SAP-001",
        metalType: "Platinum",
        metalColor: "White",
        gemstoneType: "Sapphire",
        gemstoneWeight: "2.50",
        ringSizes: ["5", "6", "7", "8"],
        weight: "5.8",
      },
      {
        name: "Emerald Cut Diamond Ring",
        slug: "emerald-cut-diamond-ring",
        description:
          "Sophisticated emerald-cut diamond ring with baguette side stones in 18k white gold setting.",
        price: "225000.00",
        imageUrl: "/assets/Product_card_1772877259308.png",
        images: ["/assets/Product_card_1772877259308.png"],
        category: "Engagement",
        featured: true,
        inStock: true,
        stockQuantity: 3,
        sku: "RING-EMR-001",
        metalType: "18k Gold",
        metalColor: "White",
        gemstoneType: "Diamond",
        gemstoneWeight: "2.00",
        ringSizes: ["5", "6", "7", "8", "9"],
        weight: "4.2",
      },
    ];

    for (const product of products) {
      await storage.createProduct(product);
    }
  }

}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Endpoint to get a CSRF token
  app.get("/api/csrf-token", (req, res) => {
    const token = generateCsrfToken();
    (req as any).session = (req as any).session || {};
    (req as any).session.csrfToken = token;
    res.json({ csrfToken: token });
  });

  // ==================== AUTH ROUTES ====================
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByUsername(input.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingEmail = await storage.getUserByEmail(input.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(input);
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        phone: user.phone,
        address: user.address,
        city: user.city,
        county: user.county,
        createdAt: user.createdAt,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      return res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      // Try to find user by username first (for admin), then by email
      let user = await storage.getUserByUsername(input.username);
      if (!user) {
        user = await storage.getUserByEmail(input.username);
      }

      if (!user || user.password !== input.password) {
        return res
          .status(401)
          .json({ message: "Invalid username/email or password" });
      }

      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
        phone: user.phone,
        address: user.address,
        city: user.city,
        county: user.county,
        createdAt: user.createdAt,
      });
    } catch (err) {
      return res.status(400).json({ message: "Login failed" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    res.status(200).json({ success: true });
  });

  app.get(api.auth.me.path, (req, res) => {
    // For MVP, return 401 as full session not wired up
    res.status(401).json({ message: "Not authenticated" });
  });

  // ==================== PRODUCT ROUTES ====================
  app.get(api.products.list.path, async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        metalType: req.query.metalType as string,
        gemstoneType: req.query.gemstoneType as string,
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice as string)
          : undefined,
        featured: req.query.featured === "true",
        inStock: req.query.inStock === "true",
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as "asc" | "desc",
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
        offset: req.query.offset
          ? parseInt(req.query.offset as string)
          : undefined,
      };

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get(api.products.get.path, async (req, res) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get(api.products.getBySlug.path, async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // ==================== CATEGORY ROUTES ====================
  app.get(api.categories.list.path, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get(api.categories.get.path, async (req, res) => {
    try {
      const category = await storage.getCategory(Number(req.params.id));
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // ==================== CART ROUTES ====================
  app.get(api.cart.get.path, async (req, res) => {
    try {
      // For now, use sessionId from query or create guest cart
      const sessionId =
        (req.query.sessionId as string) || `guest-${Date.now()}`;
      const cartData = await storage.getCart(undefined, sessionId);

      if (!cartData) {
        // Create new cart
        const newCart = await storage.createCart(undefined, sessionId);
        return res.json({
          ...newCart,
          items: [],
          subtotal: 0,
          totalItems: 0,
        });
      }

      res.json(cartData);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post(api.cart.addItem.path, async (req, res) => {
    try {
      const input = api.cart.addItem.input.parse(req.body);
      const sessionId =
        (req.query.sessionId as string) || `guest-${Date.now()}`;

      // Get or create cart
      let cartData = await storage.getCart(undefined, sessionId);
      if (!cartData) {
        const newCart = await storage.createCart(undefined, sessionId);
        cartData = { ...newCart, items: [], subtotal: 0, totalItems: 0 };
      }

      const cartItem = await storage.addToCart(cartData.id, input.productId, {
        quantity: input.quantity,
        ringSize: input.ringSize || null,
        metalType: input.metalType || null,
        metalColor: input.metalColor || null,
        chainLength: input.chainLength || null,
        engraving: input.engraving || null,
        giftWrap: input.giftWrap,
      });

      // Return updated cart
      const updatedCart = await storage.getCart(undefined, sessionId);
      res.json(updatedCart);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put(api.cart.updateItem.path, async (req, res) => {
    try {
      const cartItemId = Number(req.params.id);
      const data = req.body;

      const updatedItem = await storage.updateCartItem(cartItemId, {
        quantity: data.quantity,
        ringSize: data.ringSize,
        metalType: data.metalType,
        metalColor: data.metalColor,
        chainLength: data.chainLength,
        engraving: data.engraving,
        giftWrap: data.giftWrap,
      });

      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      const updatedCart = await storage.getCart(
        undefined,
        req.query.sessionId as string,
      );
      res.json(updatedCart);
    } catch (err) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete(api.cart.removeItem.path, async (req, res) => {
    try {
      const cartItemId = Number(req.params.id);
      await storage.removeCartItem(cartItemId);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete(api.cart.clear.path, async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string;
      const cartData = await storage.getCart(undefined, sessionId);

      if (cartData) {
        await storage.clearCart(cartData.id);
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // ==================== WISHLIST ROUTES ====================
  app.get(api.wishlist.get.path, async (req, res) => {
    // For MVP, require userId (in production, get from session)
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const wishlist = await storage.getWishlist(userId);
      res.json(wishlist);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post(api.wishlist.addItem.path, async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const input = api.wishlist.addItem.input.parse(req.body);
      const item = await storage.addToWishlist(userId, input.productId);
      res.json({ success: true, id: item.id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete(api.wishlist.removeItem.path, async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const productId = Number(req.params.productId);
      await storage.removeFromWishlist(userId, productId);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  app.get(api.wishlist.check.path, async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const productId = Number(req.params.productId);
      const isInWishlist = await storage.isInWishlist(userId, productId);
      res.json({ isInWishlist });
    } catch (err) {
      res.status(500).json({ message: "Failed to check wishlist status" });
    }
  });

  // ==================== ORDER ROUTES ====================
  app.get(api.orders.list.path, async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get(api.orders.get.path, async (req, res) => {
    try {
      const order = await storage.getOrder(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.get(api.orders.getByNumber.path, async (req, res) => {
    try {
      const order = await storage.getOrderByOrderNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post(api.orders.create.path, async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const input = api.orders.create.input.parse(req.body);

      // Get cart items
      const sessionId = req.query.sessionId as string;
      const cartData = await storage.getCart(undefined, sessionId);

      if (!cartData || cartData.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate totals
      const subtotal = cartData.subtotal;
      const shippingCost = await storage.getShippingCost(input.shippingCounty);
      const tax = subtotal * 0.16; // 16% VAT in Kenya
      const discount = 0;
      const total = subtotal + shippingCost + tax - discount;

      // Create order
      const order = await storage.createOrder({
        userId,
        items: cartData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: parseFloat(item.priceAtAdd),
          ringSize: item.ringSize,
          metalType: item.metalType,
          metalColor: item.metalColor,
          chainLength: item.chainLength,
          engraving: item.engraving,
          giftWrap: item.giftWrap,
        })),
        subtotal,
        shippingCost,
        tax,
        discount,
        total,
        currency: "KES",
        paymentMethod: input.paymentMethod,
        shippingInfo: {
          firstName: input.shippingFirstName,
          lastName: input.shippingLastName,
          phone: input.shippingPhone,
          email: input.shippingEmail,
          address: input.shippingAddress,
          city: input.shippingCity,
          county: input.shippingCounty,
          postalCode: input.shippingPostalCode,
          instructions: input.shippingInstructions,
        },
      });

      // Clear cart
      await storage.clearCart(cartData.id);

      // For M-Pesa, initiate payment
      if (input.paymentMethod === "mpesa" && input.mpesaPhoneNumber) {
        // In production, this would call the M-Pesa STK Push API
        // For now, we'll simulate a successful payment
        await storage.updatePaymentStatus(
          order.id,
          "paid",
          `MPESA-${Date.now()}`,
        );
        await storage.updateOrderStatus(order.id, "processing");
      }

      const fullOrder = await storage.getOrder(order.id);
      res.status(201).json(fullOrder);
    } catch (err) {
      console.error("Order creation error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // ==================== REVIEW ROUTES ====================
  app.get(api.reviews.list.path, async (req, res) => {
    try {
      const productId = Number(req.params.productId);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post(api.reviews.create.path, async (req, res) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const input = api.reviews.create.input.parse(req.body);
      const productId = Number(req.params.productId);

      const review = await storage.createReview({
        productId,
        userId,
        rating: input.rating,
        title: input.title || null,
        comment: input.comment || null,
        images: input.images || [],
      });

      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // ==================== SHIPPING ROUTES ====================
  app.get(api.shipping.zones.path, async (req, res) => {
    try {
      const zones = await storage.getShippingZones();
      res.json(zones);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch shipping zones" });
    }
  });

  app.get(api.shipping.cost.path, async (req, res) => {
    try {
      const county = req.params.county;
      const cost = await storage.getShippingCost(county);
      res.json({ cost, county });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch shipping cost" });
    }
  });

  // ==================== CONFIG ROUTES ====================
  app.get(api.config.counties.path, (req, res) => {
    res.json(KENYAN_COUNTIES);
  });

  app.get(api.config.metalTypes.path, (req, res) => {
    res.json(METAL_TYPES);
  });

  app.get(api.config.gemstoneTypes.path, (req, res) => {
    res.json(GEMSTONE_TYPES);
  });

  app.get(api.config.ringSizes.path, (req, res) => {
    res.json(RING_SIZES);
  });

  app.get(api.config.chainLengths.path, (req, res) => {
    res.json(CHAIN_LENGTHS);
  });

  // Seed data on startup
  seedDatabase().catch((err) => console.error("Seed error:", String(err).replace(/[\r\n]/g, " ")));

  return httpServer;
}
