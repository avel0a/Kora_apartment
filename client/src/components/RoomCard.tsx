import { Link } from "wouter";
import { ArrowRight, Maximize, Bed, User } from "lucide-react";
import type { Room } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getAmenityIcon, parseAmenity } from "@/lib/amenity-icons";

interface RoomCardProps {
  room: Room;
  /** If true, renders as a horizontal row (image left, details right). Used on Suites listing page. */
  horizontal?: boolean;
}


export function RoomCard({ room, horizontal = false }: RoomCardProps) {
  if (horizontal) {
    return (
      <div className="group bg-white border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Image */}
          <Link href={`/rooms/${room.slug}`}>
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden cursor-pointer">
              <img
                src={room.imageUrl}
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </Link>

          {/* Right: Details */}
          <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
            {/* Title & Price */}
            <div className="mb-6">
              <Link href={`/rooms/${room.slug}`}>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3 hover:text-accent transition-colors duration-300 cursor-pointer">
                  {room.name}
                </h3>
              </Link>
              <div className="flex items-baseline gap-2">
                <span className="text-accent font-serif text-2xl md:text-3xl font-bold">
                  à partir de
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-primary font-serif text-3xl md:text-4xl font-bold">
                  ${room.price}
                </span>
                <span className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
                  / Night
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-base font-normal leading-relaxed mb-8">
              {room.description}
            </p>

            {/* Amenities Grid */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {room.amenities.slice(0, 9).map((amenity, idx) => {
                  const { icon, text } = parseAmenity(amenity);
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-accent shrink-0">
                        {getAmenityIcon(icon, 18)}
                      </span>
                      <span className="text-sm font-medium text-foreground">{text}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-4 mb-8">
              {room.size && (
                <div className="flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-lg">
                  <Maximize size={16} className="text-accent" />
                  <span className="text-sm font-semibold text-primary">{room.size}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-lg">
                <User size={16} className="text-accent" />
                <span className="text-sm font-semibold text-primary">{room.capacity} Guests</span>
              </div>
              {room.bedType && (
                <div className="flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-lg">
                  <Bed size={16} className="text-accent" />
                  <span className="text-sm font-semibold text-primary">{room.bedType}</span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link href={`/rooms/${room.slug}`}>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-none px-10 py-6 text-sm tracking-[0.2em] transition-all uppercase border border-primary w-full sm:w-auto font-bold">
                Discover More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default: vertical card layout (used on Home page featured rooms)
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white flex flex-col h-full relative cursor-pointer"
    >
      <Link href={`/rooms/${room.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden mb-6">
          <img
            src={room.imageUrl}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      
      <div className="flex flex-col flex-grow text-center px-4">
        <Link href={`/rooms/${room.slug}`}>
          <h3 className="text-2xl font-serif font-normal text-foreground mb-2 hover:text-primary transition-colors duration-300">{room.name}</h3>
        </Link>
        
        <div className="flex items-center justify-center gap-2 mb-4">
           <span className="text-primary font-serif text-xl">${room.price}</span>
           <span className="text-muted-foreground text-xs uppercase tracking-widest">/&nbsp;Night</span>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow leading-relaxed font-sans font-normal">
          {room.description}
        </p>

        <Link href={`/rooms/${room.slug}`}>
          <Button variant="link" className="text-xs tracking-[0.2em] uppercase text-primary hover:text-accent font-semibold p-0">
            Discover More
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
