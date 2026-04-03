import { z } from "zod";
import {
  insertUserSchema,
  insertProductSchema,
  insertCategorySchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertReviewSchema,
  insertWishlistSchema,
  products,
  users,
  categories,
  cartItems,
  orders,
  orderItems,
  reviews,
  wishlist,
  KENYAN_COUNTIES,
  METAL_TYPES,
  GEMSTONE_TYPES,
  RING_SIZES,
  CHAIN_LENGTHS,
} from "./schema";

const userResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  isVerified: z.boolean().nullable(),
  isAdmin: z.boolean().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  county: z.string().nullable(),
  createdAt: z.date().nullable(),
});

const productResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.string(),
  compareAtPrice: z.string().nullable(),
  imageUrl: z.string(),
  images: z.array(z.string()),
  categoryId: z.number().nullable(),
  category: z.string(),
  featured: z.boolean(),
  inStock: z.boolean(),
  stockQuantity: z.number().nullable(),
  sku: z.string().nullable(),
  metalType: z.string().nullable(),
  metalColor: z.string().nullable(),
  gemstoneType: z.string().nullable(),
  gemstoneWeight: z.string().nullable(),
  ringSizes: z.array(z.string()),
  chainLength: z.string().nullable(),
  weight: z.string().nullable(),
  dimensions: z
    .object({ length: z.number(), width: z.number(), height: z.number() })
    .nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  categoryData: z
    .object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
      parentId: z.number().nullable(),
    })
    .nullable(),
  averageRating: z.number(),
  reviewCount: z.number(),
});

const cartItemResponseSchema = z.object({
  id: z.number(),
  cartId: z.number(),
  productId: z.number(),
  quantity: z.number(),
  ringSize: z.string().nullable(),
  metalType: z.string().nullable(),
  metalColor: z.string().nullable(),
  chainLength: z.string().nullable(),
  engraving: z.string().nullable(),
  giftWrap: z.boolean(),
  priceAtAdd: z.string(),
  product: productResponseSchema,
});

const cartResponseSchema = z.object({
  id: z.number(),
  userId: z.number().nullable(),
  sessionId: z.string().nullable(),
  items: z.array(cartItemResponseSchema),
  subtotal: z.number(),
  totalItems: z.number(),
});

const orderItemResponseSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  productId: z.number(),
  productName: z.string(),
  productImageUrl: z.string().nullable(),
  quantity: z.number(),
  unitPrice: z.string(),
  total: z.string(),
  ringSize: z.string().nullable(),
  metalType: z.string().nullable(),
  metalColor: z.string().nullable(),
  chainLength: z.string().nullable(),
  engraving: z.string().nullable(),
  giftWrap: z.boolean(),
});

const orderResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  orderNumber: z.string(),
  status: z.string(),
  subtotal: z.string(),
  shippingCost: z.string(),
  tax: z.string(),
  discount: z.string(),
  total: z.string(),
  currency: z.string(),
  paymentMethod: z.string(),
  paymentStatus: z.string(),
  mpesaReceiptNumber: z.string().nullable(),
  mpesaPhoneNumber: z.string().nullable(),
  shippingFirstName: z.string().nullable(),
  shippingLastName: z.string().nullable(),
  shippingPhone: z.string().nullable(),
  shippingEmail: z.string().nullable(),
  shippingAddress: z.string().nullable(),
  shippingCity: z.string().nullable(),
  shippingCounty: z.string().nullable(),
  shippingPostalCode: z.string().nullable(),
  shippingInstructions: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(orderItemResponseSchema),
});

const errorSchema = z.object({
  message: z.string(),
});

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/auth/register" as const,
      input: insertUserSchema,
      responses: {
        201: userResponseSchema,
        400: errorSchema,
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/auth/login" as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: userResponseSchema,
        401: errorSchema,
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/auth/logout" as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
    me: {
      method: "GET" as const,
      path: "/api/auth/me" as const,
      responses: {
        200: userResponseSchema,
        401: errorSchema,
      },
    },
  },
  products: {
    list: {
      method: "GET" as const,
      path: "/api/products" as const,
      input: z
        .object({
          category: z.string().optional(),
          metalType: z.string().optional(),
          gemstoneType: z.string().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          featured: z.boolean().optional(),
          inStock: z.boolean().optional(),
          search: z.string().optional(),
          sortBy: z.string().optional(),
          sortOrder: z.enum(["asc", "desc"]).optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        })
        .optional(),
      responses: {
        200: z.array(productResponseSchema),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/products/:id" as const,
      responses: {
        200: productResponseSchema,
        404: errorSchema,
      },
    },
    getBySlug: {
      method: "GET" as const,
      path: "/api/products/slug/:slug" as const,
      responses: {
        200: productResponseSchema,
        404: errorSchema,
      },
    },
  },
  categories: {
    list: {
      method: "GET" as const,
      path: "/api/categories" as const,
      responses: {
        200: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            slug: z.string(),
            description: z.string().nullable(),
            imageUrl: z.string().nullable(),
            parentId: z.number().nullable(),
          }),
        ),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/categories/:id" as const,
      responses: {
        200: z.object({
          id: z.number(),
          name: z.string(),
          slug: z.string(),
          description: z.string().nullable(),
          imageUrl: z.string().nullable(),
          parentId: z.number().nullable(),
        }),
        404: errorSchema,
      },
    },
  },
  cart: {
    get: {
      method: "GET" as const,
      path: "/api/cart" as const,
      responses: {
        200: cartResponseSchema.nullable(),
        404: errorSchema,
      },
    },
    addItem: {
      method: "POST" as const,
      path: "/api/cart/items" as const,
      input: z.object({
        productId: z.number(),
        quantity: z.number().default(1),
        ringSize: z.string().optional(),
        metalType: z.string().optional(),
        metalColor: z.string().optional(),
        chainLength: z.string().optional(),
        engraving: z.string().optional(),
        giftWrap: z.boolean().default(false),
      }),
      responses: {
        200: cartItemResponseSchema,
        400: errorSchema,
        404: errorSchema,
      },
    },
    updateItem: {
      method: "PUT" as const,
      path: "/api/cart/items/:id" as const,
      input: z.object({
        quantity: z.number().optional(),
        ringSize: z.string().optional(),
        metalType: z.string().optional(),
        metalColor: z.string().optional(),
        chainLength: z.string().optional(),
        engraving: z.string().optional(),
        giftWrap: z.boolean().optional(),
      }),
      responses: {
        200: cartItemResponseSchema,
        400: errorSchema,
        404: errorSchema,
      },
    },
    removeItem: {
      method: "DELETE" as const,
      path: "/api/cart/items/:id" as const,
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchema,
      },
    },
    clear: {
      method: "DELETE" as const,
      path: "/api/cart" as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
  wishlist: {
    get: {
      method: "GET" as const,
      path: "/api/wishlist" as const,
      responses: {
        200: z.array(
          z.object({
            id: z.number(),
            userId: z.number(),
            productId: z.number(),
            createdAt: z.date(),
            product: productResponseSchema,
          }),
        ),
        401: errorSchema,
      },
    },
    addItem: {
      method: "POST" as const,
      path: "/api/wishlist" as const,
      input: z.object({ productId: z.number() }),
      responses: {
        200: z.object({ success: z.boolean(), id: z.number() }),
        400: errorSchema,
        401: errorSchema,
      },
    },
    removeItem: {
      method: "DELETE" as const,
      path: "/api/wishlist/:productId" as const,
      responses: {
        200: z.object({ success: z.boolean() }),
        401: errorSchema,
      },
    },
    check: {
      method: "GET" as const,
      path: "/api/wishlist/check/:productId" as const,
      responses: {
        200: z.object({ isInWishlist: z.boolean() }),
        401: errorSchema,
      },
    },
  },
  orders: {
    list: {
      method: "GET" as const,
      path: "/api/orders" as const,
      responses: {
        200: z.array(orderResponseSchema),
        401: errorSchema,
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/orders/:id" as const,
      responses: {
        200: orderResponseSchema,
        404: errorSchema,
      },
    },
    getByNumber: {
      method: "GET" as const,
      path: "/api/orders/number/:orderNumber" as const,
      responses: {
        200: orderResponseSchema,
        404: errorSchema,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/orders" as const,
      input: z.object({
        shippingFirstName: z.string(),
        shippingLastName: z.string(),
        shippingPhone: z.string(),
        shippingEmail: z.string().email(),
        shippingAddress: z.string(),
        shippingCity: z.string(),
        shippingCounty: z.string(),
        shippingPostalCode: z.string().optional(),
        shippingInstructions: z.string().optional(),
        paymentMethod: z.enum(["mpesa", "card", "bank_transfer"]),
        mpesaPhoneNumber: z.string().optional(),
        saveAddress: z.boolean().default(false),
      }),
      responses: {
        201: orderResponseSchema,
        400: errorSchema,
        401: errorSchema,
      },
    },
  },
  reviews: {
    list: {
      method: "GET" as const,
      path: "/api/products/:productId/reviews" as const,
      responses: {
        200: z.array(
          z.object({
            id: z.number(),
            productId: z.number(),
            userId: z.number(),
            rating: z.number(),
            title: z.string().nullable(),
            comment: z.string().nullable(),
            images: z.array(z.string()),
            isVerifiedPurchase: z.boolean(),
            createdAt: z.date(),
          }),
        ),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/products/:productId/reviews" as const,
      input: z.object({
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        comment: z.string().optional(),
        images: z.array(z.string()).default([]),
      }),
      responses: {
        201: z.object({
          id: z.number(),
          productId: z.number(),
          userId: z.number(),
          rating: z.number(),
          title: z.string().nullable(),
          comment: z.string().nullable(),
          images: z.array(z.string()),
          isVerifiedPurchase: z.boolean(),
          createdAt: z.date(),
        }),
        400: errorSchema,
        401: errorSchema,
      },
    },
  },
  shipping: {
    zones: {
      method: "GET" as const,
      path: "/api/shipping/zones" as const,
      responses: {
        200: z.array(
          z.object({
            id: z.number(),
            county: z.string(),
            cost: z.string(),
            estimatedDays: z.number().nullable(),
          }),
        ),
      },
    },
    cost: {
      method: "GET" as const,
      path: "/api/shipping/cost/:county" as const,
      responses: {
        200: z.object({ cost: z.number(), county: z.string() }),
        404: errorSchema,
      },
    },
  },
  config: {
    counties: {
      method: "GET" as const,
      path: "/api/config/counties" as const,
      responses: {
        200: z.array(z.string()),
      },
    },
    metalTypes: {
      method: "GET" as const,
      path: "/api/config/metal-types" as const,
      responses: {
        200: z.array(z.string()),
      },
    },
    gemstoneTypes: {
      method: "GET" as const,
      path: "/api/config/gemstone-types" as const,
      responses: {
        200: z.array(z.string()),
      },
    },
    ringSizes: {
      method: "GET" as const,
      path: "/api/config/ring-sizes" as const,
      responses: {
        200: z.array(z.string()),
      },
    },
    chainLengths: {
      method: "GET" as const,
      path: "/api/config/chain-lengths" as const,
      responses: {
        200: z.array(z.string()),
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
