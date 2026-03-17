import { db } from "./db";
import { rooms, bookings, contacts, users, siteSettings, galleryImages, roomImages, type Room, type InsertRoom, type Booking, type InsertBooking, type Contact, type InsertContact, type User, type InsertUser, type SiteSetting, type GalleryImage, type InsertGalleryImage, type RoomImage, type InsertRoomImage } from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Rooms
  getRooms(): Promise<Room[]>;
  getRoomBySlug(slug: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: number, room: Partial<InsertRoom>): Promise<Room>;
  deleteRoom(id: number): Promise<void>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookings(): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;

  // Contacts
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  deleteContact(id: number): Promise<void>;

  // Site Settings
  getSettings(): Promise<SiteSetting[]>;
  getSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSetting(key: string, value: string): Promise<SiteSetting>;
  upsertSettings(settings: Record<string, string>): Promise<void>;

  // Gallery Images
  getGalleryImages(): Promise<GalleryImage[]>;
  addGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<void>;

  // Room Images
  getRoomImages(roomId: number): Promise<RoomImage[]>;
  addRoomImage(image: InsertRoomImage): Promise<RoomImage>;
  deleteRoomImage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getRooms(): Promise<Room[]> {
    return await db.select().from(rooms);
  }

  async getRoomBySlug(slug: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.slug, slug));
    return room;
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const [room] = await db.insert(rooms).values(insertRoom).returning();
    return room;
  }

  async updateRoom(id: number, insertRoom: Partial<InsertRoom>): Promise<Room> {
    const [room] = await db.update(rooms).set(insertRoom).where(eq(rooms.id, id)).returning();
    return room;
  }

  async deleteRoom(id: number): Promise<void> {
    await db.delete(roomImages).where(eq(roomImages.roomId, id));
    await db.delete(rooms).where(eq(rooms.id, id));
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }

  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(bookings.createdAt);
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const [booking] = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
    return booking;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async deleteContact(id: number): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

  // Site Settings
  async getSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }

  async upsertSetting(key: string, value: string): Promise<SiteSetting> {
    const [setting] = await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value } })
      .returning();
    return setting;
  }

  async upsertSettings(settings: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(settings)) {
      await db
        .insert(siteSettings)
        .values({ key, value })
        .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
    }
  }

  // Gallery Images
  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));
  }

  async addGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [created] = await db.insert(galleryImages).values(image).returning();
    return created;
  }

  async deleteGalleryImage(id: number): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  // Room Images
  async getRoomImages(roomId: number): Promise<RoomImage[]> {
    return await db.select().from(roomImages).where(eq(roomImages.roomId, roomId)).orderBy(asc(roomImages.sortOrder), asc(roomImages.id));
  }

  async addRoomImage(image: InsertRoomImage): Promise<RoomImage> {
    const [created] = await db.insert(roomImages).values(image).returning();
    return created;
  }

  async deleteRoomImage(id: number): Promise<void> {
    await db.delete(roomImages).where(eq(roomImages.id, id));
  }
}

export const storage = new DatabaseStorage();

