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
let pgliteClient: PGlite | undefined;

if (!process.env.DATABASE_URL) {
  const dbPath = path.resolve(process.cwd(), "db-storage");
  const lockFile = path.resolve(dbPath, "postmaster.pid");

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  // Clear stale lock file if it exists to prevent "Aborted" error on restart
  if (fs.existsSync(lockFile)) {
    try {
      console.log(`[db] Removing stale lock file: ${lockFile}`);
      fs.unlinkSync(lockFile);
    } catch (e) {
      console.error(`[db] Failed to remove lock file (it may be in use): ${e}`);
    }
  }

  // Use a dedicated folder for persistence
  pgliteClient = new PGlite(dbPath);
  db = drizzlePglite(pgliteClient, { schema });
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg(pool, { schema });
}

/**
 * Gracefully close all database connections.
 * This MUST be called before the process exits to prevent
 * stale PGlite lock files that cause 503 errors on cPanel.
 */
export async function closeDb(): Promise<void> {
  try {
    if (pgliteClient) {
      await pgliteClient.close();
      console.log("[db] PGlite connection closed cleanly.");

      // Belt-and-suspenders: remove lock file after close
      const lockFile = path.resolve(process.cwd(), "db-storage", "postmaster.pid");
      if (fs.existsSync(lockFile)) {
        fs.unlinkSync(lockFile);
        console.log("[db] Removed PGlite lock file after shutdown.");
      }
    }
    if (pool) {
      await pool.end();
      console.log("[db] PostgreSQL pool closed cleanly.");
    }
  } catch (err) {
    console.error("[db] Error during database shutdown:", err);
  }
}

// @ts-ignore
export { pool, db };
