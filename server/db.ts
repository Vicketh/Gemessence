import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { URL } from "url";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Validate DATABASE_URL to prevent SSRF - only allow postgres/postgresql protocol
const dbUrl = new URL(process.env.DATABASE_URL);
if (!['postgres:', 'postgresql:'].includes(dbUrl.protocol)) {
  throw new Error("DATABASE_URL must use postgres or postgresql protocol");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
