import { db } from "./server/db";
import { rooms, roomImages, siteSettings, galleryImages } from "./shared/schema";

async function reseed() {
  console.log("Clearing all room images...");
  await db.delete(roomImages);
  console.log("Clearing gallery images...");
  await db.delete(galleryImages);
  console.log("Clearing old rooms...");
  await db.delete(rooms);

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
      amenities: ["Wifi:Complimentary Wi-Fi throughout the apartment", "Coffee:Fully equipped kitchen with modern appliances", "Sofa:Spacious living room and dining area", "Shirt:Private washing machine", "TV:Smart TV", "Sparkles:Daily housekeeping service", "Heating:Backup power supply", "Shield:24-hour security", "Parking:Free on-site parking"]
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
      amenities: ["Bathtub:All bedrooms with private en-suite bathrooms", "Wifi:Complimentary Wi-Fi throughout the apartment", "Coffee:Fully equipped kitchen with modern appliances", "Sofa:Spacious living room and dining area", "Shirt:Private washing machine", "TV:Smart TV", "Sparkles:Daily housekeeping service", "Heating:Backup power supply", "Shield:24-hour security", "Parking:Free on-site parking"]
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
      amenities: ["Bathtub:All bedrooms with private en-suite bathrooms", "Wifi:Complimentary Wi-Fi throughout the apartment", "Coffee:Fully equipped kitchen with modern appliances", "Sofa:Very spacious living room and dining area", "DoorOpen:Separate family entertainment room", "Shirt:Private laundry room", "Lamp:Large veranda with outdoor seating space", "TV:Smart TV", "Sparkles:Daily housekeeping service", "Heating:Backup power supply", "Shield:24-hour security", "Parking:Free on-site parking"]
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
      amenities: ["Bathtub:All bedrooms with private en-suite bathrooms", "Wifi:Complimentary Wi-Fi throughout the apartment", "Coffee:Fully equipped kitchen with modern appliances", "Sofa:Very spacious living room and dining area", "DoorOpen:Separate family entertainment room", "Shirt:Private laundry room", "Lamp:Vast veranda with outdoor seating space", "TV:Smart TV", "Sparkles:Daily housekeeping service", "Heating:Backup power supply", "Shield:24-hour security", "Parking:Free on-site parking"]
    }
  ];

  console.log("Inserting accurate rooms...");
  for (const roomType of roomTypes) {
    await db.insert(rooms).values(roomType);
  }

  console.log("Updating site settings...");
  await db.insert(siteSettings)
    .values({ key: "rooms_section_tagline", value: "CURATED COLLECTION" })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value: "CURATED COLLECTION" } });

  await db.insert(siteSettings)
    .values({ key: "rooms_section_title", value: "Comfortable Residences" })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value: "Comfortable Residences" } });

  console.log("Inserting gallery images...");
  const galleryPhotos = [
    { imageUrl: "https://images.unsplash.com/photo-1542314831-c6a4d14fff46?q=80&w=1000&auto=format&fit=crop", caption: "Hotel Exterior" },
    { imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop", caption: "Master Suite" },
    { imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop", caption: "Luxury Bedroom" },
    { imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop", caption: "Modern Living Area" },
    { imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop", caption: "Dining Space" },
    { imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop", caption: "Business Center" },
    { imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09be1587?q=80&w=1000&auto=format&fit=crop", caption: "Spacious Balcony" },
    { imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop", caption: "Spa & Wellness" },
    { imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000&auto=format&fit=crop", caption: "Fully Equipped Kitchen" },
    { imageUrl: "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd28?q=80&w=1000&auto=format&fit=crop", caption: "Bathroom Amenities" },
    { imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1000&auto=format&fit=crop", caption: "Lounge Area" },
    { imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1000&auto=format&fit=crop", caption: "Reception Desk" }
  ];

  for (const photo of galleryPhotos) {
    await db.insert(galleryImages).values(photo);
  }

  console.log("Update complete! Check your website.");
  process.exit(0);
}

reseed().catch(console.error);
