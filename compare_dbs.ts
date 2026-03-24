import { PGlite } from "@electric-sql/pglite";
import path from "path";

async function verifyPath(name: string, relativePath: string) {
  const dbPath = path.resolve(process.cwd(), relativePath);
  console.log(`Checking ${name} at: ${dbPath}`);
  
  try {
    const client = new PGlite(dbPath);
    const settings = await client.query("SELECT count(*) FROM site_settings;");
    const countRow = settings.rows[0] as { count: number };
    console.log(`${name} Site Settings count:`, countRow);
    
    if (countRow.count > 0) {
        const sample = await client.query("SELECT key, value FROM site_settings WHERE key = 'site_name' LIMIT 1;");
        const sampleRow = sample.rows[0] as { value: string } | undefined;
        console.log(`${name} Site Name:`, sampleRow?.value);
    }
    await client.close();
  } catch (e: any) {
    console.log(`${name} Error:`, e.message);
  }
}

async function verifyAll() {
  await verifyPath("Old DB (.drizzle/pglite)", ".drizzle/pglite");
  await verifyPath("New DB (db-storage)", "db-storage");
}

verifyAll();
