import { Link } from "wouter";
import { ArrowRight, Star, MapPin, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/components/RoomCard";
import { useRooms } from "@/hooks/use-rooms";

export default function Home() {
  const { data: rooms, isLoading } = useRooms();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - Modern Hotel Lobby/Facade */}
        <div className="absolute inset-0 z-0">
          {/* unsplash: modern luxury hotel lobby warm lighting */}
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Momona Hotel Lobby" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in duration-1000">
          <div className="flex items-center justify-center gap-2 text-accent mb-4">
            <Star className="fill-current" size={20} />
            <Star className="fill-current" size={20} />
            <Star className="fill-current" size={20} />
            <Star className="fill-current" size={20} />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
            Luxury in the Heart of <br/> <span className="text-accent italic">Addis Ababa</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
            Experience Ethiopian hospitality redefined. Just 3 minutes from Bole International Airport.
          </p>
          <div className="pt-8">
            <Link href="/rooms">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-serif rounded-none">
                Reserve Your Stay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Spa in the Sky",
              description: "Relax in our 9th-floor sanctuary with steam, sauna, and panoramic city views.",
              icon: "🧖‍♀️"
            },
            {
              title: "Prime Location",
              description: "Located on Bole Road, moments from shopping, dining, and the airport.",
              icon: "📍"
            },
            {
              title: "Rooftop Pool",
              description: "Unwind by our temperature-controlled pool overlooking the skyline.",
              icon: "🏊‍♂️"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 border border-border/50 text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-md">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-serif font-semibold text-primary mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-accent font-medium tracking-widest uppercase text-sm">Accommodations</span>
              <h2 className="text-4xl font-serif font-bold text-primary mt-2">Rooms & Suites</h2>
            </div>
            <Link href="/rooms">
              <Button variant="link" className="text-primary hover:text-accent p-0 flex items-center gap-2">
                View All Rooms <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-[400px] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms?.slice(0, 3).map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Experience / About Section */}
      <section className="section-padding bg-primary text-white overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                A Stay Defined by <br/><span className="text-accent">Comfort & Class</span>
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Whether you're visiting Addis Ababa for business or leisure, Momona Hotel offers a perfect blend of traditional Ethiopian hospitality and modern luxury.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Complimentary High-Speed WiFi",
                  "24/7 Room Service & Concierge",
                  "Free Airport Shuttle Service",
                  "International Buffet Breakfast"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-accent" size={20} />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/amenities">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary mt-4 rounded-none h-12 px-8">
                  Explore Amenities
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 border-2 border-accent/30 translate-x-4 translate-y-4" />
              {/* unsplash: fine dining restaurant interior luxury */}
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80" 
                alt="Restaurant" 
                className="relative w-full h-auto shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
