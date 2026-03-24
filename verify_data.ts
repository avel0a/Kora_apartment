import { PGlite } from "@electric-sql/pglite";
import path from "path";

async function verify() {
  const dbPath = path.resolve(process.cwd(), "db-storage");
  console.log(`Checking database at: ${dbPath}`);
  
  const client = new PGlite(dbPath);
  
  try {
    const settings = await client.query("SELECT count(*) FROM site_settings;");
    const countRow = settings.rows[0] as { count: number };
    console.log("Site Settings count:", countRow);
    
    const rooms = await client.query("SELECT count(*) FROM rooms;");
    console.log("Rooms count:", rooms.rows[0]);
    
    if (countRow.count > 0) {
        const sample = await client.query("SELECT key, value FROM site_settings LIMIT 5;");
        console.log("Sample settings:", sample.rows);
    }
  } catch (e) {
    console.error("Error querying database:", e);
  } finally {
    await client.close();
  }
}

verify();
