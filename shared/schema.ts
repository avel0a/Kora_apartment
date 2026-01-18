import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Executive Room", "Suite"
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in USD or local currency (cents or whole)
  capacity: integer("capacity").notNull(),
  size: text("size"), // e.g., "45m²"
  bedType: text("bed_type"), // e.g., "King Size"
  imageUrl: text("image_url").notNull(),
  amenities: text("amenities").array(), // e.g., ["Free WiFi", "Bathtub"]
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(), // Intentionally not a foreign key for simplicity in MVP, or could be
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  adults: integer("adults").notNull().default(1),
  children: integer("children").notNull().default(0),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertRoomSchema = createInsertSchema(rooms).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, status: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });

// === TYPES ===

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
