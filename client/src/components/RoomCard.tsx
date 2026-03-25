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
      whileHover={{ y: -10 }}
      className="group bg-white rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-col gap-1">
             <span className="text-accent font-bold tracking-[0.2em] text-[10px] uppercase">Starting from</span>
             <div className="flex items-baseline gap-1">
               <span className="text-3xl font-serif font-bold text-white">${room.price}</span>
               <span className="text-white/60 text-sm">/night</span>
             </div>
          </div>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-serif font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300">{room.name}</h3>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow leading-relaxed font-light">
          {room.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {room.size && (
            <div className="flex items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors duration-300">
              <div className="bg-secondary/50 p-2 rounded-lg">
                <Maximize size={16} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">{room.size}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors duration-300">
            <div className="bg-secondary/50 p-2 rounded-lg">
              <Wifi size={16} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider">Hi-Speed Wifi</span>
          </div>
        </div>

        <Link href={`/rooms/${room.slug}`}>
          <Button className="w-full btn-primary rounded-xl py-6 font-bold tracking-widest uppercase hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20">
            Discover Suite
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
