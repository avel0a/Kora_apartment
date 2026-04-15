import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RoomCard } from "@/components/RoomCard";
import { useRooms } from "@/hooks/use-rooms";
import { useSettings, getSetting } from "@/hooks/use-settings";
import { useSEO } from "@/hooks/use-seo";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Rooms() {
  useSEO({
    title: "Suites | Apartment-Style Suites from US$89 | Kora Hotel Suites, Addis Ababa",
    description: "Choose from 2 to 4-bedroom suites at Kora Hotel Suites near Dembel Square. From US$89/night. Fully furnished with kitchens, private laundry, en-suite bathrooms, and African art. Sleeps 4-8."
  });

  const { data: rooms, isLoading } = useRooms();
  const { data: settings } = useSettings();

  const headerImage = getSetting(settings, "rooms_header_image", "");
  const headerTagline = getSetting(settings, "rooms_header_tagline", "Curated Collection");
  const headerTitle = getSetting(settings, "rooms_header_title", "Our Suites");
  const headerSubtitle = getSetting(settings, "rooms_header_subtitle", "Fully furnished apartment-style suites from 110 m² to 290 m² — with equipped kitchens, private laundry, en-suite bathrooms, and space that feels like home.");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-grow flex flex-col">
      {/* Cinematic Header */}
      <section className="relative pt-48 pb-24 overflow-hidden text-white bg-primary">
        {headerImage ? (
          <>
            <div className="absolute inset-0 z-0">
              <img src={headerImage} alt="" className="w-full h-full object-cover" fetchPriority="high" decoding="async" />
              <div className="absolute inset-0 bg-black/60" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--accent)_1px,_transparent_1px)] bg-[size:40px_40px]" />
          </div>
        )}
        
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-4 block">{headerTagline}</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">{headerTitle}</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              {headerSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Room Grid */}
      <section className="py-24 flex-grow bg-secondary/20">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl overflow-hidden border border-border/50 animate-pulse">
                  <div className="aspect-[4/5] bg-muted" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-muted rounded-lg w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="h-10 bg-muted rounded-lg" />
                      <div className="h-10 bg-muted rounded-lg" />
                    </div>
                    <div className="h-12 bg-muted rounded-xl" />
                  </div>
                </div>
              ))}
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

      </main>

      <Footer />
    </div>
  );
}
