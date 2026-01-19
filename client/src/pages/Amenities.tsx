import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Utensils, Dumbbell, Waves, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Amenities() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="bg-primary pt-32 pb-16 text-center text-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Dining & Wellness</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Rejuvenate your senses and indulge your palate at Momona.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-grow">
        
        {/* Dining */}
        <section id="dining" className="py-20">
          <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-[400px] overflow-hidden rounded-lg shadow-xl group">
              {/* unsplash: gourmet food plating fine dining */}
              <img 
                src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
                alt="Fine Dining" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-2 text-accent">
                <Utensils size={24} />
                <span className="uppercase tracking-widest text-sm font-semibold">Restaurant & Bar</span>
              </div>
              <h2 className="text-4xl font-serif text-primary">Culinary Excellence</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our main restaurant serves a delightful fusion of traditional Ethiopian delicacies and international favorites. Enjoy our extensive buffet breakfast, business lunch, or a romantic dinner.
              </p>
              <ul className="space-y-2 text-foreground/80">
                <li>• Daily International Buffet Breakfast</li>
                <li>• 24-Hour Room Service</li>
                <li>• Lobby Bar with Signature Cocktails</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Spa/Pool */}
        <section id="spa" className="py-20 bg-secondary/30">
          <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-accent">
                <Waves size={24} />
                <span className="uppercase tracking-widest text-sm font-semibold">Spa & Pool</span>
              </div>
              <h2 className="text-4xl font-serif text-primary">Spa in the Sky</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Located on the 9th floor, our wellness center offers panoramic views of Addis Ababa. Unwind in the steam room, sauna, or take a dip in our rooftop pool.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Card className="p-4 hover-elevate">
                  <div className="flex items-center gap-3">
                    <Dumbbell className="text-accent" /> 
                    <div>
                      <h4 className="font-serif font-semibold">Modern Gym</h4>
                      <p className="text-xs text-muted-foreground">High-end cardio & weights</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover-elevate">
                  <div className="flex items-center gap-3">
                    <Waves className="text-accent" /> 
                    <div>
                      <h4 className="font-serif font-semibold">Rooftop Pool</h4>
                      <p className="text-xs text-muted-foreground">Temperature controlled</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover-elevate">
                  <div className="flex items-center gap-3">
                    <Waves className="text-accent rotate-90" /> 
                    <div>
                      <h4 className="font-serif font-semibold">Steam & Sauna</h4>
                      <p className="text-xs text-muted-foreground">Relaxation therapy</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl group">
               {/* unsplash: luxury indoor swimming pool spa */}
               <img 
                src="https://images.unsplash.com/photo-1571896349842-6e53ce41e887?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
                alt="Spa and Pool" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </section>

        {/* Gym Detail (New Content) */}
        <section id="gym" className="py-20">
          <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl group">
               {/* unsplash: modern hotel gym equipment */}
               <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" 
                alt="Modern Gym" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-accent">
                <Dumbbell size={24} />
                <span className="uppercase tracking-widest text-sm font-semibold">Fitness Center</span>
              </div>
              <h2 className="text-4xl font-serif text-primary">State-of-the-Art Fitness</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Stay active during your stay with our fully equipped fitness center. We provide a range of modern cardio machines, weight-lifting equipment, and yoga space.
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-foreground/80">
                <li>• Treadmills & Ellipticals</li>
                <li>• Free Weights Area</li>
                <li>• Strength Training Machines</li>
                <li>• Yoga Mats & Accessories</li>
                <li>• 24/7 Access for Guests</li>
                <li>• Professional Trainers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Meetings */}
        <section className="py-20">
          <div className="container-custom text-center max-w-3xl mx-auto space-y-8">
            <Monitor className="mx-auto text-accent w-12 h-12" />
            <h2 className="text-4xl font-serif text-primary">Meetings & Events</h2>
            <p className="text-muted-foreground text-lg">
              Host your next conference or social event in our versatile meeting spaces equipped with modern audiovisual technology and high-speed internet.
            </p>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
