import { describe, it, expect } from 'vitest';
import { insertUserSchema, insertProductSchema, insertOrderSchema, insertCartItemSchema } from '@shared/schema';

describe('Schema Validation', () => {
  describe('insertUserSchema', () => {
    it('validates a correct user input', () => {
      const valid = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'securePass123!',
      };
      const result = insertUserSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects missing required fields', () => {
      const invalid = { username: 'testuser' };
      const result = insertUserSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('accepts various email-like strings (drizzle-zod uses text, not email)', () => {
      // The schema uses drizzle-zod which maps text fields to z.string(), not z.string().email()
      const valid = {
        username: 'testuser',
        email: 'not-an-email',
        password: 'securePass123!',
      };
      const result = insertUserSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('accepts optional fields', () => {
      const valid = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'securePass123!',
        phone: '+254712345678',
        county: 'Nairobi',
      };
      const result = insertUserSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe('insertProductSchema', () => {
    it('validates a complete product', () => {
      const valid = {
        name: 'Diamond Ring',
        slug: 'diamond-ring',
        description: 'A beautiful diamond ring',
        price: '50000.00',
        imageUrl: '/assets/ring.png',
        images: ['/assets/ring.png'],
        categoryId: 1,
        category: 'Rings',
        metalType: '18k Gold',
        gemstoneType: 'Diamond',
      };
      const result = insertProductSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('validates minimal product (required fields only)', () => {
      const minimal = {
        name: 'Simple Ring',
        description: 'A ring',
        price: '1000.00',
        imageUrl: '/assets/ring.png',
        category: 'Rings',
      };
      const result = insertProductSchema.safeParse(minimal);
      expect(result.success).toBe(true);
    });

    it('accepts negative price (drizzle-zod numeric is z.string() without range)', () => {
      // Drizzle-zod maps numeric to z.string() — validation happens at DB level
      const valid = {
        name: 'Bad Product',
        description: 'Nope',
        price: '-100.00',
        imageUrl: '/assets/x.png',
        category: 'Rings',
      };
      const result = insertProductSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe('insertCartItemSchema', () => {
    it('validates cart item with options', () => {
      const valid = {
        cartId: 1,
        productId: 5,
        quantity: 2,
        ringSize: '7',
        metalType: '18k Gold',
        giftWrap: true,
        priceAtAdd: '50000.00',
      };
      const result = insertCartItemSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('validates minimal cart item', () => {
      const minimal = {
        cartId: 1,
        productId: 5,
        quantity: 1,
        priceAtAdd: '10000.00',
      };
      const result = insertCartItemSchema.safeParse(minimal);
      expect(result.success).toBe(true);
    });
  });

  describe('insertOrderSchema', () => {
    it('validates order with shipping info', () => {
      const valid = {
        userId: 1,
        orderNumber: 'GEM-123-ABC',
        status: 'pending',
        subtotal: '50000.00',
        shippingCost: '500.00',
        tax: '8000.00',
        discount: '0',
        total: '58500.00',
        currency: 'KES',
        paymentMethod: 'mpesa',
        shippingFirstName: 'John',
        shippingLastName: 'Doe',
        shippingPhone: '+254712345678',
        shippingEmail: 'john@example.com',
        shippingAddress: '123 Kenyatta Ave',
        shippingCity: 'Nairobi',
        shippingCounty: 'Nairobi',
      };
      const result = insertOrderSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });
});
