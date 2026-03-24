import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import path from "path";
import { eq } from "drizzle-orm";
import * as schema from "./shared/schema";

async function main() {
  try {
    const dbPath = path.resolve(process.cwd(), "db-storage");
    const client = new PGlite(dbPath);
    const db = drizzle(client, { schema });
    
    // Fetch all settings
    const allSettings = await db.select().from(schema.siteSettings);
    
    for (const setting of allSettings) {
      let newValue = setting.value;
      if (typeof newValue === 'string') {
        newValue = newValue.replace(/MOMONA/g, "PANDA");
        newValue = newValue.replace(/Momona/g, "Panda");
        newValue = newValue.replace(/momonahotel/g, "pandahotel");
        
        if (newValue !== setting.value) {
          console.log(`Updating ${setting.key}: ${setting.value} -> ${newValue}`);
          await db.update(schema.siteSettings)
            .set({ value: newValue })
            .where(eq(schema.siteSettings.key, setting.key));
        }
      }
    }
    console.log("Database update complete!");
    process.exit(0);
  } catch (err) {
    console.error("Update failed:", err);
    process.exit(1);
  }
}

main();
