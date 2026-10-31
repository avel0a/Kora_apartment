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
  const headerTagline = getSetting(settings, "rooms_section_tagline", "Curated Collection");
  const headerTitle = getSetting(settings, "rooms_header_title", "Our Suites");
  const headerSubtitle = getSetting(settings, "rooms_header_subtitle", "Fully furnished apartment-style suites from 110 m² to 290 m² — with equipped kitchens, private laundry, en-suite bathrooms, and space that feels like home.");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-grow flex flex-col">
      {/* Cinematic Header */}
      <section className="relative pt-36 pb-16 md:pt-40 md:pb-20 overflow-hidden text-white bg-primary">
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
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-3 block">{headerTagline}</span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{headerTitle}</h1>
            <p className="text-lg text-white/85 max-w-2xl mx-auto font-normal leading-relaxed">
              {headerSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Room Listings */}
      <section className="py-12 md:py-16 flex-grow bg-secondary/20">
        <div className="container-custom">
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white overflow-hidden border border-border/50 animate-pulse">
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-5 aspect-[16/10] lg:aspect-auto lg:h-full min-h-[300px] bg-muted" />
                    <div className="lg:col-span-7 p-8 space-y-4">
                      <div className="h-7 bg-muted rounded w-3/4" />
                      <div className="h-5 bg-muted rounded w-1/3" />
                      <div className="space-y-2 pt-2">
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-5/6" />
                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="h-5 bg-muted rounded" />
                        <div className="h-5 bg-muted rounded" />
                        <div className="h-5 bg-muted rounded" />
                      </div>
                      <div className="h-10 bg-muted rounded w-36 pt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8 md:space-y-10"
            >
              {rooms?.map((room, i) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <RoomCard room={room} horizontal />
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
