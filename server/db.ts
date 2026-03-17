import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;
let pool: pg.Pool | undefined;
let db: any; 

if (!process.env.DATABASE_URL) {
  // Use in-memory database by default, or persist to .drizzle/pglite if desired
  // Using file system persistence for better dev experience across restarts
  const client = new PGlite("./.drizzle/pglite");
  console.log("Using PGlite database at ./.drizzle/pglite");

  db = drizzlePglite(client, { schema });
  // pool is not available in PGlite mode
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg(pool, { schema });
}

// @ts-ignore
export { pool, db };
