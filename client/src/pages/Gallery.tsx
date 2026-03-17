import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useGalleryImages } from "@/hooks/use-gallery";
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";

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

      {/* Header */}
      <div className="bg-primary pt-32 pb-16 text-center text-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Our Gallery</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Explore our beautifully appointed hotel apartments through our curated photo gallery.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="section-padding flex-grow">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin w-12 h-12 text-primary" />
            </div>
          ) : !images?.length ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-6xl mb-4">📷</div>
              <h2 className="text-2xl font-serif text-primary mb-2">Gallery Coming Soon</h2>
              <p className="text-muted-foreground max-w-md">
                We're curating beautiful photos of our hotel apartments. Check back soon!
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="break-inside-avoid group relative overflow-hidden rounded-lg cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.caption || "Gallery image"}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    {image.caption && (
                      <p className="text-white text-sm font-medium">{image.caption}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && images && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 z-10 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                className="absolute right-4 z-10 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="max-w-5xl max-h-[85vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].imageUrl}
              alt={images[lightboxIndex].caption || "Gallery image"}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            {images[lightboxIndex].caption && (
              <p className="text-white/90 text-center mt-4 text-lg font-serif">
                {images[lightboxIndex].caption}
              </p>
            )}
            <p className="text-white/50 text-center mt-2 text-sm">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
