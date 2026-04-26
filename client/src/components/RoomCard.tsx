import { Link } from "wouter";
import { ArrowRight, Wifi, Wind, Maximize } from "lucide-react";
import type { Room } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
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
           <span className="text-muted-foreground text-xs uppercase tracking-widest">/ Night</span>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow leading-relaxed font-sans font-light">
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
