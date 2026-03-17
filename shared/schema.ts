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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  label: text("label"),
  type: text("type").notNull().default("text"), // text, textarea, image, url
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roomImages = pgTable("room_images", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// === SCHEMAS ===

export const insertRoomSchema = createInsertSchema(rooms);
export const insertBookingSchema = createInsertSchema(bookings);
export const insertContactSchema = createInsertSchema(contacts);
export const insertUserSchema = createInsertSchema(users);
export const insertGalleryImageSchema = createInsertSchema(galleryImages);
export const insertRoomImageSchema = createInsertSchema(roomImages);

// === TYPES ===

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SiteSetting = typeof siteSettings.$inferSelect;

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;

export type RoomImage = typeof roomImages.$inferSelect;
export type InsertRoomImage = z.infer<typeof insertRoomImageSchema>;
