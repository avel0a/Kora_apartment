import { useRoute } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRoom } from "@/hooks/use-rooms";
import { BookingForm } from "@/components/BookingForm";
import { Loader2, Wifi, Tv, Coffee, Bath, Wind, Layout, User } from "lucide-react";

export default function RoomDetail() {
  const [, params] = useRoute("/rooms/:slug");
  const slug = params?.slug || "";
  const { data: room, isLoading } = useRoom(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-serif">Room Not Found</h2>
        <a href="/rooms" className="text-primary hover:underline">Back to Rooms</a>
      </div>
    );
  }

  const amenityIcons: Record<string, React.ReactNode> = {
    "Wifi": <Wifi size={20} />,
    "TV": <Tv size={20} />,
    "Coffee Maker": <Coffee size={20} />,
    "Bathtub": <Bath size={20} />,
    "AC": <Wind size={20} />,
    "Desk": <Layout size={20} />,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Image */}
      <div className="h-[50vh] relative mt-20 md:mt-0">
        <img 
          src={room.imageUrl} 
          alt={room.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">{room.name}</h1>
            <p className="text-xl text-accent font-medium">${room.price} <span className="text-sm text-white/80 font-normal">/ night</span></p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-padding flex-grow">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-serif text-primary mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {room.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Size</span>
                <span className="font-medium text-lg">{room.size || "Standard"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Occupancy</span>
                <div className="flex items-center gap-2 font-medium text-lg">
                  <User size={18} /> {room.capacity} Guests
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Bed Type</span>
                <span className="font-medium text-lg">{room.bedType || "King Bed"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground uppercase tracking-wider">View</span>
                <span className="font-medium text-lg">City / Mountain</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif text-primary mb-6">Room Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                    <span className="text-accent">{amenityIcons[amenity.split(' ')[0]] || <CheckCircle size={20} />}</span>
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
                {!room.amenities?.length && (
                  <>
                    <div className="flex items-center gap-3"><Wifi size={20} className="text-accent"/> Free Wifi</div>
                    <div className="flex items-center gap-3"><Tv size={20} className="text-accent"/> Flat Screen TV</div>
                    <div className="flex items-center gap-3"><Wind size={20} className="text-accent"/> Air Conditioning</div>
                    <div className="flex items-center gap-3"><Coffee size={20} className="text-accent"/> Tea/Coffee Maker</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm roomId={room.id} roomName={room.name} />
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

// Helper component for default icons if map lookup fails
import { CheckCircle } from "lucide-react";
