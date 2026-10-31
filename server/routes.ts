import express, { type Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";
import { sendBookingEmails, sendInquiryEmail } from "./email";
import { insertRoomSchema, insertGalleryImageSchema, insertRoomImageSchema, rooms, roomImages, galleryImages, siteSettings } from "@shared/schema";
import { db } from "./db";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { eq } from "drizzle-orm";

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

  // Prevent browser and CDN caching of API responses
  apiRouter.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  apiRouter.get("/trigger-reseed", async (req, res) => {
    try {
      const roomTypes = [
        {
          name: "Junior Suite – Two Bedroom Apartment",
          slug: "junior-suite",
          description: "Spacious and comfortable, this 110 m² apartment offers two bedrooms and ample space to work, relax, and entertain guests.\n\nAccommodates up to 4 guests:\n• Bedroom 1: King-size bed\n• Bedroom 2: Two single beds\n\nIdeal for families, business travellers, and long-term stays.",
          price: 89,
          capacity: 4,
          size: "110 m²",
          bedType: "King Bed + 2 Single Beds",
          imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop",
          amenities: ["Wifi:Complimentary Wi-Fi throughout the apartment", "Coffee:Fully equipped kitchen with modern appliances", "Sofa:Spacious living room and dining area", "Shirt:Private washing machine", "TV:Smart TV", "Sparkles:Daily housekeeping service", "Heating:Backup power supply", "Shield:24-hour security", "Parking:Free on-site parking"],
          sortOrder: 1
        },
        {
          name: "Senior Suite – Three Bedroom Apartment",
          slug: "senior-suite",
          description: "Spacious and comfortable, this 175 m² apartment features three bedrooms and ample space to work, relax, and entertain guests.\n\nAccommodates up to 6 guests:\n• Bedroom 1: King-size bed\n• Bedroom 2: Queen-size bed\n• Bedroom 3: King-size bed\n\nAll bedrooms with private en-suite bathrooms. Ideal for families, business travellers, and long-term stays seeking comfort, convenience, and privacy.",
          price: 99,
          capacity: 6,
          size: "175 m²",
          bedType: "2 King Beds + Queen Bed",
          imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop",
          amenities: ["Bathtub:All bedrooms with private en-suite bathrooms", "Wifi:Complimentary Wi-Fi throughout the apartment", "Coffee:Fully equipped kitchen with modern appliances", "Sofa:Spacious living room and dining area", "Shirt:Private washing machine", "TV:Smart TV", "Sparkles:Daily housekeeping service", "Heating:Backup power supply", "Shield:24-hour security", "Parking:Free on-site parking"],
          sortOrder: 2
        },
        {
          name: "Penthouse Suite – Four Bedroom Apartment",
          slug: "penthouse-suite",
          description: "Spacious and inviting, this 290 m² Penthouse Suite features four bedrooms and expansive living areas designed for work, relaxation, and entertaining.\n\nAccommodates up to 8 guests:\n• Bedroom 1: King-size bed\n• Bedroom 2: Queen-size bed\n• Bedroom 3: Two single beds\n• Bedroom 4: King-size bed\n\nAll bedrooms with private en-suite bathrooms. Ideal for large families, business executives, diplomatic staff, and long-term stays seeking exceptional space, comfort, and privacy.",
          price: 180,
          capacity: 8,
          size: "290 m²",
          bedType: "2 King + Queen + 2 Singles",
          imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
          amenities: ["Bathtub:All bedrooms with private en-suite bathrooms", "Wifi:Complimentary Wi-Fi throughout the apartment", "Coffee:Fully equipped kitchen with modern appliances", "Sofa:Very spacious living room and dining area", "DoorOpen:Separate family entertainment room", "Shirt:Private laundry room", "Lamp:Large veranda with outdoor seating space", "TV:Smart TV", "Sparkles:Daily housekeeping service", "Heating:Backup power supply", "Shield:24-hour security", "Parking:Free on-site parking"],
          sortOrder: 3
        },
        {
          name: "Deluxe Suite – Three Bedroom Apartment",
          slug: "deluxe-suite",
          description: "Stylish and exceptionally spacious, this 320 m² Deluxe Suite features three bedrooms, expansive living areas, and a vast veranda, offering the perfect setting to work, relax, and entertain.\n\nAccommodates up to 6 guests:\n• Bedroom 1: King-size bed\n• Bedroom 2: Queen-size bed\n• Bedroom 3: Queen-size bed\n\nAll bedrooms with private en-suite bathrooms. Ideal for families, business executives, diplomats, and long-term guests seeking exceptional space, comfort, and privacy.",
          price: 225,
          capacity: 6,
          size: "320 m²",
          bedType: "King Bed + 2 Queen Beds",
          imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop",
          amenities: ["Bathtub:All bedrooms with private en-suite bathrooms", "Wifi:Complimentary Wi-Fi throughout the apartment", "Coffee:Fully equipped kitchen with modern appliances", "Sofa:Very spacious living room and dining area", "DoorOpen:Separate family entertainment room", "Shirt:Private laundry room", "Lamp:Vast veranda with outdoor seating space", "TV:Smart TV", "Sparkles:Daily housekeeping service", "Heating:Backup power supply", "Shield:24-hour security", "Parking:Free on-site parking"],
          sortOrder: 4
        }
      ];

      for (const roomType of roomTypes) {
        console.log(`Updating room: ${roomType.slug}`);
        await db.update(rooms)
          .set(roomType)
          .where(eq(rooms.slug, roomType.slug));
      }

      res.status(200).json({ success: true, message: "Database rooms updated successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to update database rooms", details: error instanceof Error ? error.message : String(error) });
    }
  });

  const isAuthenticated = (req: any, res: any, next: any) => {
    console.log(`[auth] isAuthenticated check for ${req.path}. User present: ${!!req.user}, Authenticated: ${req.isAuthenticated()}`);
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };


  // Uploads
  apiRouter.post("/upload", isAuthenticated, upload.single("file"), async (req: any, res) => {
    console.log(`[apiRouter] POST /upload hit, file present: ${!!req.file}`);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const uploadDir = path.resolve(process.cwd(), "uploads");
      const optimizedFilename = req.file.filename.replace(path.extname(req.file.filename), "") + "-optimized.webp";
      const optimizedPath = path.join(uploadDir, optimizedFilename);

      await sharp(req.file.path)
        .rotate() // Automatically orient based on EXIF
        .resize({ width: 1920, height: 1080, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(optimizedPath);

      // Clean up the original unoptimized file
      fs.unlinkSync(req.file.path);

      const filePath = `/uploads/${optimizedFilename}`;
      res.json({ url: filePath });
    } catch (error) {
      console.error("[upload error] sharp processing failed:", error);
      // Fallback to original file if compression fails
      const filePath = `/uploads/${req.file.filename}`;
      res.json({ url: filePath });
    }
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
      
      const room = await storage.getRoom(booking.roomId);
      if (room) {
        // Send email notifications asynchronously
        sendBookingEmails(booking, room).catch(e => console.error("[Email] Failed to send booking emails:", e));
      }

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

  apiRouter.get("/debug-session", isAuthenticated, (req: any, res) => {
    res.json({
      isAuthenticated: req.isAuthenticated(),
      user: req.user ? { id: req.user.id, username: req.user.username } : null,
      sessionID: req.sessionID,
      session: req.session
    });
  });

  apiRouter.post("/contact", async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const contact = await storage.createContact(input);
      
      // Send email notification asynchronously
      sendInquiryEmail(contact).catch(e => console.error("[Email] Failed to send inquiry email:", e));

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
    await dbInstance.execute(sql`
      ALTER TABLE rooms ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
    `);
    console.log("New tables ensured (gallery_images, room_images, rooms.sort_order).");
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
        name: "Junior Suite",
        slug: "junior-suite",
        description: "It has 2 Bedrooms its size is 110 square meter it contains master bedroom with king size bed with built-in bathroom, second class bedroom with double bed with independent bathroom. Living and dinning room it contain private laundry machine all suite have private varanda and all are equipped with modern and comfortable funitures accommodate up to 4 person.",
        price: 89,
        capacity: 4,
        size: "110m²",
        bedType: "King Bed + Double Bed",
        imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop",
        amenities: ["High-Speed WiFi", "Private Laundry Machine", "Private Veranda", "Built-In Bathrooms", "Living & Dining Room", "Modern Furniture", "Fully Equipped Kitchen"]
      },
      {
        name: "Senior Suite",
        slug: "senior-suite",
        description: "It has 3 bedrooms its size is 191 square meter contain master bedroom with king size bed with built in bathroom, second class bedroom with king size bed with its own balcony and independent bathroom, Third class bedroom single bed with its independent bathroom. Living room, dinning room accommodate up to 6 persons with private Veranda with comfortable modern furniture it contains a walk in closet.",
        price: 99,
        capacity: 6,
        size: "191m²",
        bedType: "2 King Beds + 1 Single Bed",
        imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop",
        amenities: ["High-Speed WiFi", "Private Veranda", "Balcony", "Walk-in Closet", "Living & Dining Room", "Independent Bathrooms", "Modern Furniture", "Fully Equipped Kitchen"]
      },
      {
        name: "Penthouse Suite",
        slug: "penthouse-suite",
        description: "It has 4 bedroom its size is 290 square meter it contain one master bedroom with 2*2 meter bed size, jacuzzi shower, its own living room, its own veranda. The second class bedroom contain queen bed with independent bathroom, Third class bedroom double bed size contain independent bathroom, fourth class bedroom twin bed contained independent bathroom. With spacious living and dinner room. Accommodate up to 8 person have independent laundry machine have spectacular view of the city of Addis Ababa.",
        price: 180,
        capacity: 8,
        size: "290m²",
        bedType: "2x2m King + Queen + Double + Twin",
        imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
        amenities: ["Spectacular City View", "Jacuzzi Shower", "High-Speed WiFi", "Independent Laundry Machine", "Private Verandas", "Private Living Room", "Spacious Living & Dining Room", "Independent Bathrooms"]
      },
      {
        name: "Deluxe Suite",
        slug: "deluxe-suite",
        description: "Size 290 square meter 3 bedroom suites contain 2 master bedroom and one second class bedroom and all the amenities mentioned in penthouse suite with luxury and elegance.",
        price: 225,
        capacity: 6,
        size: "290m²",
        bedType: "2 Master Beds + 1 Second Class Bed",
        imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop",
        amenities: ["Luxury & Elegance", "Spectacular City View", "Jacuzzi Shower", "High-Speed WiFi", "Independent Laundry Machine", "Private Verandas", "Independent Bathrooms", "Spacious Living & Dining Room"]
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

  // Always upsert — new keys will be inserted, existing keys will not be overwritten

  const defaults = [
    // Brand
    { key: "site_name", value: "KORA", label: "Site Name", type: "text" },
    { key: "site_subtitle", value: "Hotel Suites", label: "Site Subtitle", type: "text" },
    { key: "company_logo", value: "", label: "Company Logo", type: "image" },

    // Hero Section
    { key: "hero_image", value: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", label: "Hero Background Image", type: "image" },
    { key: "hero_title", value: "Where Your Journey Finds Its Rhythm", label: "Hero Title", type: "text" },
    { key: "hero_subtitle", value: "Modern boutique suites next to Dembel Square — 10 minutes from Bole International Airport. Fully furnished, apartment-style living enriched with African art and soul.", label: "Hero Subtitle", type: "textarea" },

    // About Section
    { key: "about_image", value: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80", label: "About Section Image", type: "image" },
    { key: "about_title", value: "Elegance Inspired by Heritage", label: "About Title", type: "text" },
    { key: "about_description", value: "Kora Hotel Suites is a modern boutique hotel next to Dembel Square, 10 minutes from Bole International Airport. Designed by the family members who manage the business, every suite is enriched with elegant African artifacts, giving it a unique and authentic ambiance. Fully furnished apartment-style suites for short-term and long-term guests. Kora Hotel Suites is your home — not simply a place to visit.", label: "About Description", type: "textarea" },

    // Contact
    { key: "contact_address", value: "Near Dembel Square, Addis Ababa, Ethiopia", label: "Address", type: "text" },
    { key: "contact_phone", value: "+251 11 661 0404", label: "Phone Number", type: "text" },
    { key: "contact_email", value: "info@korahotelsuites.com", label: "Email Address", type: "text" },

    // Map Location
    { key: "map_latitude", value: "9.0054", label: "Map Latitude", type: "text" },
    { key: "map_longitude", value: "38.7893", label: "Map Longitude", type: "text" },

    // Social Links
    { key: "facebook_url", value: "#", label: "Facebook URL", type: "url" },
    { key: "instagram_url", value: "#", label: "Instagram URL", type: "url" },
    { key: "twitter_url", value: "#", label: "Twitter/X URL", type: "url" },
    { key: "tiktok_url", value: "#", label: "TikTok URL", type: "url" },
    
    // Email Settings
    { key: "smtp_host", value: "", label: "SMTP Host", type: "text" },
    { key: "smtp_port", value: "587", label: "SMTP Port", type: "text" },
    { key: "smtp_user", value: "", label: "SMTP Username", type: "text" },
    { key: "smtp_pass", value: "", label: "SMTP Password", type: "password" },
    { key: "smtp_from", value: "noreply@korahotelsuites.com", label: "From Email Header", type: "text" },
    { key: "admin_booking_email", value: "admin@korahotelsuites.com", label: "Admin Notification Email", type: "text" },

    // Authentication Page
    { key: "auth_image", value: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop", label: "Login Background Image", type: "image" },
    { key: "auth_title", value: "Kora Hotel Suites", label: "Login Title", type: "text" },
    { key: "auth_subtitle", value: "Experience Luxury & Comfort", label: "Login Subtitle", type: "text" },
  ];

  for (const setting of defaults) {
    await dbInstance.insert(siteSettings).values(setting).onConflictDoNothing();
  }
  console.log("Site settings seeded.");
}
