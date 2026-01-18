import { Link } from "wouter";
import { ArrowRight, Wifi, Wind, Maximize } from "lucide-react";
import type { Room } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="group bg-white rounded-none overflow-hidden border border-border/40 hover:border-accent/50 hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={room.imageUrl}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif font-semibold text-primary">{room.name}</h3>
          <span className="text-lg font-medium text-accent">${room.price}<span className="text-sm text-muted-foreground font-sans font-normal">/night</span></span>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
          {room.description}
        </p>
        
        <div className="flex gap-4 mb-6 text-xs text-muted-foreground">
          {room.size && (
            <div className="flex items-center gap-1">
              <Maximize size={14} /> {room.size}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Wifi size={14} /> Free Wifi
          </div>
          <div className="flex items-center gap-1">
            <Wind size={14} /> AC
          </div>
        </div>

        <Link href={`/rooms/${room.slug}`}>
          <Button variant="outline" className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-colors">
            View Details <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
