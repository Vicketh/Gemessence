import { z } from "zod";
import { insertUserSchema, insertProductSchema, products, users } from "./schema";

const userResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  isVerified: z.boolean().nullable(),
  createdAt: z.date().nullable(),
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
      input: z.object({ email: z.string(), password: z.string() }),
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
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/products/:id" as const,
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchema,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
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
