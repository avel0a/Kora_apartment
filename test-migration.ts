import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import path from "path";

async function main() {
  try {
    const dbPath = path.resolve(process.cwd(), "db-storage");
    const client = new PGlite(dbPath);
    const db = drizzle(client);
    
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("Migrations successful!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:");
    console.error(err);
    process.exit(1);
  }
}

main();
