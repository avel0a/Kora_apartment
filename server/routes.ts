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
    const slug = req.params.slug;
    if (typeof slug !== 'string') {
      return res.status(400).json({ message: "Invalid room slug" });
    }
    const room = await storage.getRoomBySlug(slug);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  });

  // Bookings
  app.get(api.bookings.list.path, async (req, res) => {
    const bookings = await storage.getBookings();
    res.json(bookings);
  });

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
