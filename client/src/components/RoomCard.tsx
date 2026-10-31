import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowRight, Maximize, Bed, User, ChevronLeft, ChevronRight, DoorClosed } from "lucide-react";
import type { Room } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getAmenityIcon, parseAmenity } from "@/lib/amenity-icons";
import { useRoomImages } from "@/hooks/use-room-images";

interface RoomCardProps {
  room: Room;
  /** If true, renders as a horizontal row (image left, details right). Used on Suites listing page. */
  horizontal?: boolean;
}


export function RoomCard({ room, horizontal = false }: RoomCardProps) {
  const { data: extraImages } = useRoomImages(horizontal ? room.id : undefined);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const allImages = horizontal ? [
    { url: room.imageUrl, caption: room.name },
    ...(extraImages || []).map(img => ({ url: img.imageUrl, caption: "" }))
  ] : [];

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentImageIdx((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentImageIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    if (!horizontal || allImages.length <= 1) return;
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, [horizontal, allImages.length, nextImage]);

  if (horizontal) {
    return (
      <div className="group bg-white border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left: Image Slideshow */}
          <div className="lg:col-span-5 relative">
            <Link href={`/rooms/${room.slug}`}>
              <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full min-h-[260px] lg:min-h-[380px] max-h-[500px] overflow-hidden cursor-pointer">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIdx}
                    src={allImages[currentImageIdx]?.url || room.imageUrl}
                    alt={room.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                </AnimatePresence>
                
                {allImages.length > 1 && (
                  <>
                    <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 z-20">
                      {allImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentImageIdx(idx);
                          }}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === currentImageIdx ? "bg-white w-5" : "bg-white/50 w-1.5 hover:bg-white/80"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all z-20"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all z-20"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>
            </Link>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-8 flex flex-col justify-between">
            {/* Title & Price Header */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3 pb-3 border-b border-border/40">
                <Link href={`/rooms/${room.slug}`}>
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-primary hover:text-accent transition-colors duration-300 cursor-pointer">
                    {room.name}
                  </h3>
                </Link>
                <div className="flex items-baseline gap-2 shrink-0">
                  <span className="text-accent text-xs uppercase tracking-wider font-semibold">From</span>
                  <span className="text-primary font-serif text-2xl lg:text-3xl font-bold">${room.price}</span>
                  <span className="text-muted-foreground text-xs uppercase tracking-widest font-medium">/ Night</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm font-normal leading-relaxed mb-4 whitespace-pre-line">
                {room.description}
              </p>

              {/* Amenities Grid */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 mb-5 pt-1">
                  {room.amenities.slice(0, 9).map((amenity, idx) => {
                    const { icon, text } = parseAmenity(amenity);
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-accent shrink-0">
                          {getAmenityIcon(icon, 15)}
                        </span>
                        <span className="text-xs font-medium text-foreground truncate" title={text}>{text}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Section: Quick Info Pills & Button */}
            <div className="pt-3 border-t border-border/40">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {room.size && (
                    <div className="flex items-center gap-1.5 bg-secondary/15 px-3 py-1.5 rounded">
                      <Maximize size={14} className="text-accent" />
                      <span className="text-xs font-semibold text-primary">{room.size}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 bg-secondary/15 px-3 py-1.5 rounded">
                    <DoorClosed size={14} className="text-accent" />
                    <span className="text-xs font-semibold text-primary">
                      {room.name.includes("Two") ? "2 Bedrooms" : room.name.includes("Three") ? "3 Bedrooms" : room.name.includes("Four") ? "4 Bedrooms" : room.capacity <= 4 ? "2 Bedrooms" : room.capacity <= 6 ? "3 Bedrooms" : "4 Bedrooms"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-secondary/15 px-3 py-1.5 rounded">
                    <User size={14} className="text-accent" />
                    <span className="text-xs font-semibold text-primary">{room.capacity} Guests</span>
                  </div>
                  {room.bedType && (
                    <div className="flex items-center gap-1.5 bg-secondary/15 px-3 py-1.5 rounded">
                      <Bed size={14} className="text-accent" />
                      <span className="text-xs font-semibold text-primary">{room.bedType}</span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Link href={`/rooms/${room.slug}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-none px-6 py-2.5 h-auto text-xs tracking-[0.15em] transition-all uppercase border border-primary font-bold shrink-0">
                    Reserve Suite
                  </Button>
                </Link>
              </div>
            </div>
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
            Reserve Suite
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
