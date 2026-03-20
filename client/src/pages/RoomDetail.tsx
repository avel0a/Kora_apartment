import { useState, useEffect, useCallback } from "react";
import { useRoute } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRoom } from "@/hooks/use-rooms";
import { useRoomImages } from "@/hooks/use-room-images";
import { BookingForm } from "@/components/BookingForm";
import { Loader2, Wifi, Tv, Coffee, Bath, Wind, Layout, User, ChevronLeft, ChevronRight, CheckCircle, Maximize, Bed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function RoomDetail() {
  const [, params] = useRoute<{slug: string}>("/rooms/:slug");
  const slug = params ? params.slug : "";
  const { data: room, isLoading } = useRoom(slug);
  const { data: extraImages } = useRoomImages(room?.id);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Build image array: main image + extra images
  const allImages = room ? [
    { url: room.imageUrl, caption: room.name },
    ...(extraImages || []).map(img => ({ url: img.imageUrl, caption: "" }))
  ] : [];

  const goNext = useCallback(() => {
    if (allImages.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % allImages.length);
    }
  }, [allImages.length]);

  const goPrev = useCallback(() => {
    if (allImages.length > 1) {
      setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  }, [allImages.length]);

  // Auto-advance slideshow every 8 seconds for a slower, more cinematic feel
  useEffect(() => {
    if (allImages.length <= 1) return;
    const timer = setInterval(goNext, 8000);
    return () => clearInterval(timer);
  }, [allImages.length, goNext]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-16 h-16 animate-spin text-primary/20" />
        <span className="text-sm font-bold tracking-[0.3em] text-primary/40 uppercase">Preparing your suite...</span>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-8 bg-background">
        <h2 className="text-4xl font-serif font-bold text-primary">Suite Not Found</h2>
        <a href="/rooms">
          <Button variant="outline" className="rounded-xl px-8 h-14 font-bold tracking-widest uppercase border-primary/20 hover:bg-primary hover:text-white transition-all">
             Back to Collection
          </Button>
        </a>
      </div>
    );
  }

  const amenityIcons: Record<string, React.ReactNode> = {
    "Wifi": <Wifi size={20} />,
    "TV": <Tv size={20} />,
    "Coffee": <Coffee size={20} />,
    "Bathtub": <Bath size={20} />,
    "AC": <Wind size={20} />,
    "Desk": <Layout size={20} />,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Cinematic Hero Slideshow */}
      <section className="h-[75vh] relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={allImages[currentSlide]?.url}
              alt={`${room.name} - Photo ${currentSlide + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10" />
        
        {/* Slideshow Navigation */}
        {allImages.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 container-custom flex justify-between px-4 pointer-events-none">
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="pointer-events-auto glass w-16 h-16 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-2xl group"
            >
              <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="pointer-events-auto glass w-16 h-16 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-2xl group"
            >
              <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-12 md:p-24 z-20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-white tracking-tight leading-[1.1]">{room.name}</h1>
              <div className="flex items-center gap-8">
                <div className="flex items-baseline gap-2">
                   <span className="text-4xl font-serif font-bold text-accent">${room.price}</span>
                   <span className="text-white/60 text-sm uppercase tracking-widest font-bold">/ night</span>
                </div>
                <div className="h-8 w-[1px] bg-white/20" />
                <span className="text-white/80 font-light flex items-center gap-2">
                  <Maximize size={18} className="text-accent" /> {room.size || "Standard"} Living Space
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            
            {/* Suite Details */}
            <div className="lg:col-span-2 space-y-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-4 block">The Experience</span>
                <h2 className="text-4xl font-serif font-bold text-primary mb-8">Unparalleled Comfort</h2>
                <p className="text-muted-foreground leading-relaxed text-xl font-light">
                  {room.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-10 py-12 border-y border-border/50"
              >
                {[
                  { label: "Guest Capacity", value: `${room.capacity} Persons`, icon: <User size={24} /> },
                  { label: "Bed Configuration", value: room.bedType || "King Suite", icon: <Bed size={24} /> },
                  { label: "Total Area", value: room.size || "Spacious", icon: <Maximize size={24} /> },
                  { label: "Suite View", value: "Panoramic City", icon: <Wind size={24} /> }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="text-accent">{item.icon}</div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold block">{item.label}</span>
                      <span className="text-lg font-serif font-bold text-primary block">{item.value}</span>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-serif font-bold text-primary mb-10">Premium Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {room.amenities?.length ? (
                    room.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 bg-secondary/20 rounded-2xl border border-transparent hover:border-primary/10 hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="bg-primary/5 p-3 rounded-xl text-primary">
                          {amenityIcons[amenity.split(' ')[0]] || <CheckCircle size={20} />}
                        </div>
                        <span className="text-sm font-bold tracking-wide text-primary/80">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    ["Gigabit WiFi", "65\" Smart TV", "Climate Control", "Artisan Coffee"].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 bg-secondary/20 rounded-2xl">
                         <div className="bg-primary/5 p-3 rounded-xl text-primary">
                           <CheckCircle size={20} />
                         </div>
                         <span className="text-sm font-bold tracking-wide text-primary/80">{item}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-32">
                <div className="glass p-8 md:p-10 rounded-3xl shadow-2xl border-white/40 space-y-8">
                  <div className="text-center pb-6 border-b border-black/5">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted-foreground block mb-2">Reservation</span>
                    <h3 className="text-3xl font-serif font-bold text-primary">Secure Your Suite</h3>
                  </div>
                  <BookingForm roomId={room.id} roomName={room.name} />
                </div>
                
                {/* Visual Accent */}
                <div className="mt-8 p-6 bg-primary rounded-2xl text-white text-center space-y-2">
                   <p className="text-xs tracking-[0.2em] font-bold text-accent uppercase">Expert Assistance</p>
                   <p className="text-lg font-serif">Call +251 116 123 456</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
