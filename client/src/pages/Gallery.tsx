import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useGalleryImages } from "@/hooks/use-gallery";
import { Loader2, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Gallery() {
  const { data: images, isLoading } = useGalleryImages();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null && images) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null && images) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Cinematic Header */}
      <section className="relative pt-48 pb-24 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--accent)_1px,_transparent_1px)] bg-[size:40px_40px]" />
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Visual Journey</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Our Gallery</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Step into a world of refined elegance and traditional charm through our curated lens.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 flex-grow bg-background">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-96 gap-4">
              <Loader2 className="animate-spin w-12 h-12 text-primary" />
              <span className="text-sm font-bold tracking-widest text-primary/40 uppercase">Loading Gallery...</span>
            </div>
          ) : !images?.length ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-96 text-center bg-secondary/20 rounded-3xl border-2 border-dashed border-border/50 p-12"
            >
              <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 text-primary/20">
                <Camera size={64} strokeWidth={1} />
              </div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-4">Gallery Coming Soon</h2>
              <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
                We're currently curating a stunning visual experience of our hotel apartments. Check back very soon!
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              {images.map((image, i) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 bg-secondary/20"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.caption || "Gallery image"}
                    className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                     <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {image.caption && (
                          <p className="text-white text-lg font-serif font-medium mb-2">{image.caption}</p>
                        )}
                        <span className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase">View Masterpiece</span>
                     </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && images && images[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={closeLightbox}
          >
            {/* Close */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-8 right-8 z-10 text-white/80 hover:text-white p-4 rounded-full glass hover:bg-white/20 transition-all shadow-2xl"
              onClick={closeLightbox}
            >
              <X size={28} />
            </motion.button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="absolute left-4 md:left-8 z-10 text-white/80 hover:text-white p-5 rounded-full glass hover:bg-white/20 transition-all shadow-2xl"
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                >
                  <ChevronLeft size={32} />
                </motion.button>
                <motion.button
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="absolute right-4 md:right-8 z-10 text-white/80 hover:text-white p-5 rounded-full glass hover:bg-white/20 transition-all shadow-2xl"
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                >
                  <ChevronRight size={32} />
                </motion.button>
              </>
            )}

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightboxIndex].imageUrl}
                alt={images[lightboxIndex].caption || "Gallery image"}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)]"
              />
              <div className="mt-8 text-center space-y-2">
                {images[lightboxIndex].caption && (
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
                    {images[lightboxIndex].caption}
                  </h3>
                )}
                <p className="text-white/40 text-xs font-bold tracking-[0.4em] uppercase pt-2">
                  IMAGE {lightboxIndex + 1} OF {images.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
