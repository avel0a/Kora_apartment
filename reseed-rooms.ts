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
      name: "Junior Suite",
      slug: "junior-suite",
      description: "It has 2 Bedrooms. Size is 110 square meters. It contains a master bedroom with a king size bed and private bathroom, and a second class bedroom with a double bed and private bathroom. Features a spacious living room, dining room, fully equipped kitchen, and private laundry machine. All suites have a private veranda and are equipped with modern comfortable furniture. Accommodates up to 4 persons.",
      price: 89,
      capacity: 4,
      size: "110m²",
      bedType: "King Bed + Double Bed",
      imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop",
      amenities: ["High-Speed WiFi", "Private Laundry", "Private Veranda", "Private Bathrooms", "Living & Dining Room", "Fully Equipped Kitchen"]
    },
    {
      name: "Senior Suite",
      slug: "senior-suite",
      description: "It has 3 Bedrooms. Size is 191 square meters. It contains a master bedroom with a king size bed and private bathroom, a second class bedroom with a king size bed, balcony, and private bathroom, and a third class bedroom with a single bed and private bathroom. Features a spacious living room, dining room, fully equipped kitchen, walk-in closet, and private laundry. All suites have a private veranda and modern comfortable furniture. Accommodates up to 6 persons.",
      price: 99,
      capacity: 6,
      size: "191m²",
      bedType: "2 King Beds + 1 Single Bed",
      imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop",
      amenities: ["High-Speed WiFi", "Private Veranda", "Balcony", "Walk-in Closet", "Living & Dining", "Private Bathrooms", "Fully Equipped Kitchen"]
    },
    {
      name: "Penthouse Suite",
      slug: "penthouse-suite",
      description: "It has 4 Bedrooms. Size is 290 square meters. It contains a master bedroom with a 2x2 meter bed, jacuzzi shower, private living room, private veranda, and private bathroom. The second class bedroom contains a queen bed with a private bathroom. The third class bedroom contains a double bed with a private bathroom. The fourth class bedroom contains twin beds with a private bathroom. Features a spacious living and dining room, fully equipped kitchen, independent laundry machine, and a spectacular view of Addis Ababa. Accommodates up to 8 persons.",
      price: 180,
      capacity: 8,
      size: "290m²",
      bedType: "2x2m King + Queen + Double + Twin",
      imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
      amenities: ["City View", "Jacuzzi Shower", "High-Speed WiFi", "Laundry Machine", "Private Verandas", "Private Bathrooms", "Fully Equipped Kitchen"]
    },
    {
      name: "Deluxe Suite",
      slug: "deluxe-suite",
      description: "It has 3 Bedrooms. Size is 290 square meters. Contains 2 master bedrooms and one second class bedroom, all with private bathrooms. Features luxury and elegance with all the premium amenities of the penthouse suite, including an expansive living room, dining room, and fully equipped kitchen. Accommodates up to 6 persons.",
      price: 225,
      capacity: 6,
      size: "290m²",
      bedType: "2 Master Beds + 1 Double Bed",
      imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop",
      amenities: ["Luxury & Elegance", "City View", "Jacuzzi Shower", "High-Speed WiFi", "Laundry Machine", "Private Verandas", "Private Bathrooms", "Fully Equipped Kitchen"]
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
