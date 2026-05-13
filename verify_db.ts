import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./shared/schema";

async function verify() {
  const client = new PGlite("./db-storage");
  const db = drizzle(client, { schema });

  const allBookings = await db.select().from(schema.bookings);
  console.log("Total bookings:", allBookings.length);
  allBookings.forEach((b, i) => {
    console.log(`Booking ${i+1}: ID=${b.id}, Guest=${b.guestName}, Email=${b.guestEmail}, Status=${b.status}`);
  });

  const allRooms = await db.select().from(schema.rooms);
  console.log("Total rooms:", allRooms.length);
}

verify().catch(console.error);
