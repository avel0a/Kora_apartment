import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import * as schema from "./shared/schema";
import path from "path";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function resetAdminPassword() {
  const newPassword = process.argv[2];
  if (!newPassword) {
    console.error("❌ Please provide a new password.");
    console.error("Usage: npx tsx reset-admin.ts <new_password>");
    process.exit(1);
  }

  try {
    const dbPath = path.resolve(process.cwd(), "db-storage");
    const client = new PGlite(dbPath);
    const db = drizzle(client, { schema });

    // Check if admin user exists first
    const [adminUser] = await db.select().from(schema.users).where(eq(schema.users.username, "admin"));
    
    if (!adminUser) {
      console.error("❌ Admin user not found in the database. Start the server once to automatically seed it.");
      process.exit(1);
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    await db.update(schema.users)
      .set({ password: hashedPassword })
      .where(eq(schema.users.username, "admin"));

    console.log(`✅ Successfully reset admin password to: ${newPassword}`);
    console.log("Make sure no background node processes are holding the DB lock before running this command.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to update password:", err);
    process.exit(1);
  }
}

resetAdminPassword();
