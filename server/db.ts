import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;
let pool: pg.Pool | undefined;
let db: any; 

if (!process.env.DATABASE_URL) {
  // Use in-memory database to avoid RuntimeError: Aborted on some Windows environments
  const client = new PGlite();
  console.log("Using in-memory PGlite database");

  db = drizzlePglite(client, { schema });
  // pool is not available in PGlite mode
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg(pool, { schema });
}

// @ts-ignore
export { pool, db };
