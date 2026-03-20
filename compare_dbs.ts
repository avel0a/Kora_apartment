import { PGlite } from "@electric-sql/pglite";
import path from "path";

async function verifyPath(name: string, relativePath: string) {
  const dbPath = path.resolve(process.cwd(), relativePath);
  console.log(`Checking ${name} at: ${dbPath}`);
  
  try {
    const client = new PGlite(dbPath);
    const settings = await client.query("SELECT count(*) FROM site_settings;");
    console.log(`${name} Site Settings count:`, settings.rows[0]);
    
    if (settings.rows[0].count > 0) {
        const sample = await client.query("SELECT key, value FROM site_settings WHERE key = 'site_name' LIMIT 1;");
        console.log(`${name} Site Name:`, sample.rows[0]?.value);
    }
    await client.close();
  } catch (e) {
    console.log(`${name} Error:`, e.message);
  }
}

async function verifyAll() {
  await verifyPath("Old DB (.drizzle/pglite)", ".drizzle/pglite");
  await verifyPath("New DB (db-storage)", "db-storage");
}

verifyAll();
