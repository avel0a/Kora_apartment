import {
  Wifi,
  Tv,
  Coffee,
  Bath,
  Wind,
  Layout,
  Wine,
  CheckCircle,
  Car,
  Utensils,
  Shirt,
  ShowerHead,
  Lock,
  Phone,
  Refrigerator,
  Flame,
  Snowflake,
  Dumbbell,
  Sparkles,
  Eye,
  Mountain,
  Trees,
  Waves,
  Baby,
  Shield,
  Clock,
  Microwave,
  Bed,
  DoorOpen,
  Lamp,
  VolumeX,
  Sofa,
  type LucideIcon,
} from "lucide-react";

/**
 * Comprehensive hotel amenity icon registry.
 * Used by admin panel (dropdown), RoomCard, and RoomDetail pages.
 * 
 * Format: "IconKey" -> { icon: LucideIconComponent, label: "Human Readable Label" }
 * 
 * When stored in the DB, amenities use the format: "IconKey:Amenity Text"
 * e.g. "Wifi:High-Speed WiFi" or "Parking:Free Parking"
 */
export const AMENITY_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  // Connectivity & Entertainment
  "Wifi":          { icon: Wifi,          label: "WiFi" },
  "TV":            { icon: Tv,            label: "TV / Smart TV" },
  "Phone":         { icon: Phone,         label: "Phone" },

  // Climate & Comfort
  "AC":            { icon: Snowflake,     label: "Air Conditioning" },
  "Heating":       { icon: Flame,         label: "Heating" },
  "Wind":          { icon: Wind,          label: "Ventilation / Fan" },
  "VolumeX":       { icon: VolumeX,       label: "Soundproofing" },

  // Bathroom
  "Bathtub":       { icon: Bath,          label: "Bathtub" },
  "Shower":        { icon: ShowerHead,    label: "Shower" },

  // Kitchen & Dining
  "Coffee":        { icon: Coffee,        label: "Coffee / Tea" },
  "Microwave":     { icon: Microwave,     label: "Microwave" },
  "Utensils":      { icon: Utensils,      label: "Dining / Restaurant" },
  "Wine":          { icon: Wine,          label: "Mini Bar" },

  // Laundry & Clothing
  "Shirt":         { icon: Shirt,          label: "Closet / Wardrobe" },

  // Room Features
  "Desk":          { icon: Layout,        label: "Work Desk" },
  "Sofa":          { icon: Sofa,          label: "Living Room / Sofa" },
  "Bed":           { icon: Bed,           label: "Bedroom" },
  "Lamp":          { icon: Lamp,          label: "Balcony / Terrace" },
  "DoorOpen":      { icon: DoorOpen,      label: "Private Entrance" },

  // Views
  "Eye":           { icon: Eye,           label: "City View" },
  "Mountain":      { icon: Mountain,      label: "Mountain View" },
  "Trees":         { icon: Trees,         label: "Garden View" },
  "Waves":         { icon: Waves,         label: "Pool / Water View" },

  // Services & Security
  "Parking":       { icon: Car,           label: "Parking" },
  "Lock":          { icon: Lock,          label: "Safe / Security" },
  "Shield":        { icon: Shield,        label: "24/7 Security" },
  "Clock":         { icon: Clock,         label: "24h Reception" },
  "Sparkles":      { icon: Sparkles,      label: "Housekeeping" },
  "Baby":          { icon: Baby,          label: "Family Friendly" },
  "Dumbbell":      { icon: Dumbbell,      label: "Gym / Fitness" },

  // Fallback
  "CheckCircle":   { icon: CheckCircle,   label: "Other" },
};

/** Sorted icon keys for use in admin dropdown */
export const AMENITY_ICON_KEYS = Object.keys(AMENITY_ICONS);

/** Get the React icon element for a given icon key at a specific size */
export function getAmenityIcon(iconKey: string, size: number = 20): React.ReactNode {
  const entry = AMENITY_ICONS[iconKey];
  if (entry) {
    const IconComponent = entry.icon;
    return <IconComponent size={size} />;
  }
  const FallbackIcon = CheckCircle;
  return <FallbackIcon size={size} />;
}

/** Parse amenity string format "IconKey:Text" */
export function parseAmenity(amenity: string): { icon: string; text: string } {
  if (amenity.includes(":")) {
    const [iconName, ...textParts] = amenity.split(":");
    return { icon: iconName.trim(), text: textParts.join(":").trim() };
  }
  return { icon: "CheckCircle", text: amenity };
}
