import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Rooms
  app.get(api.rooms.list.path, async (req, res) => {
    const rooms = await storage.getRooms();
    res.json(rooms);
  });

  app.get(api.rooms.get.path, async (req, res) => {
    const room = await storage.getRoomBySlug(req.params.slug);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  });

  // Bookings
  app.post(api.bookings.create.path, async (req, res) => {
    try {
      const input = api.bookings.create.input.parse(req.body);
      const booking = await storage.createBooking(input);
      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Contacts
  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      await storage.createContact(input);
      res.status(201).json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const rooms = await storage.getRooms();
  if (rooms.length === 0) {
    console.log("Seeding rooms...");
    await storage.createRoom({
      name: "Standard Single Room",
      slug: "standard-single",
      description: "Perfect for business travelers, our Single Rooms offer a comfortable king-size bed, work desk, and stunning mountain views.",
      price: 80,
      capacity: 1,
      size: "30m²",
      bedType: "King Size",
      imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop",
      amenities: ["Free WiFi", "Mountain View", "Work Desk", "Mini Bar", "Flat-screen TV"]
    });

    await storage.createRoom({
      name: "Executive Twin Room",
      slug: "executive-twin",
      description: "Spacious twin room with modern amenities, perfect for friends or colleagues sharing. Includes a balcony with city views.",
      price: 120,
      capacity: 2,
      size: "40m²",
      bedType: "2 Twin Beds",
      imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop",
      amenities: ["Free WiFi", "City View", "Balcony", "Coffee Maker", "Safe"]
    });

    await storage.createRoom({
      name: "Luxury Suite",
      slug: "luxury-suite",
      description: "Experience ultimate luxury in our spacious suites featuring a separate living area, jacuzzi, and premium amenities.",
      price: 200,
      capacity: 2,
      size: "65m²",
      bedType: "King Size",
      imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop",
      amenities: ["Free WiFi", "Jacuzzi", "Living Area", "Welcome Fruit Basket", "Bathrobes"]
    });
    console.log("Rooms seeded.");
  }
}
