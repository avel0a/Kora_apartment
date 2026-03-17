import express, { type Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";
import { insertRoomSchema, insertGalleryImageSchema, insertRoomImageSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage_multer = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const uploadDir = path.resolve(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage_multer });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  setupAuth(app);

  const apiRouter = express.Router();

  const isAuthenticated = (req: any, res: any, next: any) => {
    console.log(`[auth] isAuthenticated check for ${req.path}. User present: ${!!req.user}, Authenticated: ${req.isAuthenticated()}`);
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Uploads
  apiRouter.post("/upload", isAuthenticated, upload.single("file"), (req: any, res) => {
    console.log(`[apiRouter] POST /upload hit, file present: ${!!req.file}`);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ url: filePath });
  });

  // Rooms
  apiRouter.get("/rooms", async (_req, res) => {
    const rooms = await storage.getRooms();
    res.json(rooms);
  });

  apiRouter.get("/rooms/:slug", async (req, res) => {
    const room = await storage.getRoomBySlug(req.params.slug);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  });

  apiRouter.patch("/rooms/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`[apiRouter] PATCH /rooms/${id} hit`);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    try {
        const roomData = insertRoomSchema.partial().parse(req.body);
        const room = await storage.updateRoom(id, roomData);
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.json(room);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors });
        throw err;
    }
  });

  apiRouter.post("/rooms", isAuthenticated, async (req, res) => {
    try {
        const roomData = insertRoomSchema.parse(req.body);
        const room = await storage.createRoom(roomData);
        res.status(201).json(room);
    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors });
        throw err;
    }
  });

  apiRouter.delete("/rooms/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteRoom(id);
    res.sendStatus(204);
  });

  // Room Images
  apiRouter.get("/rooms/:id/images", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const images = await storage.getRoomImages(id);
    res.json(images);
  });

  apiRouter.post("/rooms/:id/images", isAuthenticated, async (req, res) => {
    const roomId = parseInt(req.params.id);
    if (isNaN(roomId)) return res.status(400).json({ message: "Invalid room ID" });
    try {
      const { imageUrl, sortOrder } = req.body;
      const image = await storage.addRoomImage({ roomId, imageUrl, sortOrder: sortOrder || 0 });
      res.status(201).json(image);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors });
      throw err;
    }
  });

  apiRouter.delete("/room-images/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteRoomImage(id);
    res.sendStatus(204);
  });

  // Gallery Images
  apiRouter.get("/gallery", async (_req, res) => {
    const images = await storage.getGalleryImages();
    res.json(images);
  });

  apiRouter.post("/gallery", isAuthenticated, async (req, res) => {
    try {
      const { imageUrl, caption, sortOrder } = req.body;
      const image = await storage.addGalleryImage({ imageUrl, caption: caption || null, sortOrder: sortOrder || 0 });
      res.status(201).json(image);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors });
      throw err;
    }
  });

  apiRouter.delete("/gallery/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteGalleryImage(id);
    res.sendStatus(204);
  });

  // Bookings
  apiRouter.get("/admin/bookings", isAuthenticated, async (_req, res) => {
    const bookings = await storage.getBookings();
    res.json(bookings);
  });

  apiRouter.post("/bookings", async (req, res) => {
    try {
      const input = api.bookings.create.input.parse(req.body);
      const booking = await storage.createBooking(input);
      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  apiRouter.patch("/bookings/:id/status", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (isNaN(id) || !status) return res.status(400).json({ message: "Invalid request" });
    const booking = await storage.updateBookingStatus(id, status);
    res.json(booking);
  });

  // Contacts
  apiRouter.get("/contacts", isAuthenticated, async (_req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  apiRouter.post("/contact", async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      await storage.createContact(input);
      res.status(201).json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  apiRouter.delete("/contacts/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteContact(id);
    res.sendStatus(204);
  });

  // Site Settings
  apiRouter.get("/settings", async (_req, res) => {
    const settings = await storage.getSettings();
    const settingsMap: Record<string, any> = {};
    for (const s of settings) {
      settingsMap[s.key] = { value: s.value, label: s.label, type: s.type };
    }
    res.json(settingsMap);
  });

  apiRouter.patch("/settings", isAuthenticated, async (req, res) => {
    try {
      const updates = req.body as Record<string, string>;
      await storage.upsertSettings(updates);
      const settings = await storage.getSettings();
      const settingsMap: Record<string, any> = {};
      for (const s of settings) {
        settingsMap[s.key] = { value: s.value, label: s.label, type: s.type };
      }
      res.json(settingsMap);
    } catch (err) {
      console.error("[PATCH /api/settings] Error:", err);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // API Catch-all
  apiRouter.use((req, res) => {
    res.status(404).json({ message: `API route ${req.method} ${req.url} not found` });
  });

  app.use("/api", apiRouter);

  // Ensure new tables exist (for PGlite where drizzle-kit push isn't available)
  await ensureNewTables();

  // Seed Data
  await seedDatabase();
  await seedSettings();

  return httpServer;
}

async function ensureNewTables() {
  const { db: dbInstance } = await import("./db");
  const { sql } = await import("drizzle-orm");
  try {
    await dbInstance.execute(sql`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        caption TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await dbInstance.execute(sql`
      CREATE TABLE IF NOT EXISTS room_images (
        id SERIAL PRIMARY KEY,
        room_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0
      )
    `);
    console.log("New tables ensured (gallery_images, room_images).");
  } catch (err) {
    console.error("Error creating new tables:", err);
  }
}

async function seedDatabase() {
  const roomsCount = await storage.getRooms();
  if (roomsCount.length === 0) {
    console.log("Seeding rooms...");
    const roomTypes = [
      {
        name: "Executive Room",
        slug: "executive",
        description: "Experience the pinnacle of luxury in our Executive Rooms, designed for the discerning traveler with premium finishes and city views.",
        price: 150,
        capacity: 2,
        size: "45m²",
        bedType: "King Size",
        imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop",
        amenities: ["Free WiFi", "City View", "Mini Bar", "Work Desk", "Coffee Maker"]
      },
      {
        name: "Deluxe Room",
        slug: "deluxe",
        description: "Our Deluxe Rooms offer enhanced space and comfort, featuring elegant decor and top-tier amenities for a relaxing stay.",
        price: 130,
        capacity: 2,
        size: "40m²",
        bedType: "King Size",
        imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop",
        amenities: ["Free WiFi", "Mountain View", "Flat-screen TV", "Mini Bar", "Safe"]
      },
      {
        name: "Twin Room",
        slug: "twin",
        description: "Perfect for colleagues or friends, our Twin Rooms feature two comfortable beds and all the essential amenities for a productive stay.",
        price: 110,
        capacity: 2,
        size: "38m²",
        bedType: "2 Twin Beds",
        imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop",
        amenities: ["Free WiFi", "Work Desk", "Coffee Maker", "Safe", "Mini Bar"]
      },
      {
        name: "Single Room",
        slug: "single",
        description: "Ideal for solo business travelers, offering a cozy and efficient space with a comfortable bed and work area.",
        price: 90,
        capacity: 1,
        size: "28m²",
        bedType: "Queen Size",
        imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=1000&auto=format&fit=crop",
        amenities: ["Free WiFi", "Work Desk", "Flat-screen TV", "Mini Bar"]
      },
      {
        name: "Junior Suite",
        slug: "junior-suite",
        description: "Spacious and elegant, our Junior Suites offer a separate sitting area and upgraded bathroom facilities for a touch of extra luxury.",
        price: 180,
        capacity: 2,
        size: "55m²",
        bedType: "King Size",
        imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
        amenities: ["Free WiFi", "Separate Sitting Area", "Jacuzzi", "Premium Coffee Machine", "Bathrobes"]
      }
    ];

    for (const roomType of roomTypes) {
      await storage.createRoom(roomType);
    }
    console.log("Rooms seeded.");
  }
}

async function seedSettings() {
  const { db: dbInstance } = await import("./db");
  const { siteSettings } = await import("@shared/schema");

  const defaults = [
    // Brand
    { key: "site_name", value: "MOMONA", label: "Site Name", type: "text" },
    { key: "site_subtitle", value: "Hotel Apartments", label: "Site Subtitle", type: "text" },

    // Hero Section
    { key: "hero_image", value: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", label: "Hero Background Image", type: "image" },
    { key: "hero_title", value: "Luxury in the Heart of Addis Ababa", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", value: "Experience Ethiopian hospitality redefined. Just 3 minutes from Bole International Airport.", label: "Hero Subtitle", type: "textarea" },

    // About Section
    { key: "about_image", value: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80", label: "About Section Image", type: "image" },
    { key: "about_title", value: "A Stay Defined by Comfort & Class", label: "About Title", type: "text" },
    { key: "about_description", value: "Whether you're visiting Addis Ababa for business or leisure, Momona Hotel offers a perfect blend of traditional Ethiopian hospitality and modern luxury.", label: "About Description", type: "textarea" },

    // Contact
    { key: "contact_address", value: "Bole Road, Addis Ababa, Ethiopia", label: "Address", type: "text" },
    { key: "contact_phone", value: "+251 11 661 0404", label: "Phone Number", type: "text" },
    { key: "contact_email", value: "info@momonahotel.com", label: "Email Address", type: "text" },

    // Map Location
    { key: "map_latitude", value: "9.0054", label: "Map Latitude", type: "text" },
    { key: "map_longitude", value: "38.7893", label: "Map Longitude", type: "text" },

    // Social Links
    { key: "facebook_url", value: "#", label: "Facebook URL", type: "url" },
    { key: "instagram_url", value: "#", label: "Instagram URL", type: "url" },
    { key: "twitter_url", value: "#", label: "Twitter/X URL", type: "url" },
  ];

  for (const setting of defaults) {
    await dbInstance.insert(siteSettings).values(setting).onConflictDoNothing();
  }
  console.log("Site settings seeded.");
}
