import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RoomCard } from "@/components/RoomCard";
import { useRooms } from "@/hooks/use-rooms";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Rooms() {
  const { data: rooms, isLoading } = useRooms();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Cinematic Header */}
      <section className="relative pt-48 pb-24 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--accent)_1px,_transparent_1px)] bg-[size:40px_40px]" />
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Exquisite Stays</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Our Rooms & Suites</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Curated spaces designed for the discerning traveler, blending modern luxury with timeless Ethiopian warmth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Room Grid */}
      <section className="py-24 flex-grow bg-secondary/20">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-96 gap-4">
              <Loader2 className="animate-spin w-12 h-12 text-primary" />
              <span className="text-sm font-bold tracking-widest text-primary/40 uppercase">Loading Suites...</span>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {rooms?.map((room, i) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
