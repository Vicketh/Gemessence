import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// Seed function for products
async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    await storage.createProduct({
      name: "Bloom & Gleam Earrings",
      description: "Exquisite floral earrings crafted with 18k gold and fine pearls.",
      price: "4000.00",
      imageUrl: "/assets/Product_card_1772877259308.png",
      category: "Earrings",
      featured: true,
    });
    
    await storage.createProduct({
      name: "Minimalist Beige Sneakers",
      description: "Premium leather minimalist sneakers.",
      price: "120.00",
      imageUrl: "/assets/Shopping_cart_1772877259310.png",
      category: "Shoes",
      featured: false,
    });

    await storage.createProduct({
      name: "Premium Wireless Earbuds",
      description: "Active Noise Cancellation, 30hr battery with case.",
      price: "199.99",
      imageUrl: "/assets/Product_compare_1772877259309.png",
      category: "Electronics",
      featured: false,
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Simple session-based auth implementation for MVP
  // In a production app, use Passport.js or Replit Auth properly
  
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
      // Mock login for MVP
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
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
      const user = await storage.getUserByEmail(input.email);
      
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
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
    // For MVP, we will return a 401 as we don't have full session wired up here yet.
    // The frontend can handle mock auth context for now.
    res.status(401).json({ message: "Not authenticated" });
  });

  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // Seed data on startup
  seedDatabase().catch(console.error);

  return httpServer;
}
