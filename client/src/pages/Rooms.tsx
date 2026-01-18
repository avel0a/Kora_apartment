import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RoomCard } from "@/components/RoomCard";
import { useRooms } from "@/hooks/use-rooms";
import { Loader2 } from "lucide-react";

export default function Rooms() {
  const { data: rooms, isLoading } = useRooms();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-primary pt-32 pb-16 text-center text-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Our Rooms & Suites</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Choose from our elegantly appointed accommodations designed for your ultimate comfort.
          </p>
        </div>
      </div>

      {/* Room Grid */}
      <div className="section-padding flex-grow">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin w-12 h-12 text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms?.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
