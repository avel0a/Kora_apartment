import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import * as schema from "@shared/schema";

import fs from "fs";
import path from "path";

const { Pool } = pg;
let pool: pg.Pool | undefined;
let db: any; 

if (!process.env.DATABASE_URL) {
  const dbPath = path.resolve(process.cwd(), "db-storage");
  const lockFile = path.resolve(dbPath, "postmaster.pid");

  // Clear stale lock file if it exists to prevent "Aborted" error on Windows
  if (fs.existsSync(lockFile)) {
    try {
      fs.unlinkSync(lockFile);
    } catch (e) {
      console.error(`Failed to remove lock file: ${e}`);
    }
  }

  // Use a dedicated folder for persistence
  const client = new PGlite(dbPath);

  db = drizzlePglite(client, { schema });
  // pool is not available in PGlite mode
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg(pool, { schema });
}

// @ts-ignore
export { pool, db };
