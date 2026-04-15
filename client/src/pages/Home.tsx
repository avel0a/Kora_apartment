import { Link } from "wouter";
import { ArrowRight, Star, MapPin, CheckCircle, Home as HomeIcon, Shield, Clock, Quote } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/components/RoomCard";
import { useRooms } from "@/hooks/use-rooms";
import { useSettings, getSetting } from "@/hooks/use-settings";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";

export default function Home() {
  useSEO({
    title: "Luxury Serviced Apartments in Addis Ababa",
    description: "Kora Hotel Suites — 4-star serviced apartments near Meskel Square, Addis Ababa. Fully equipped kitchens, spa & sauna, free parking, 24/7 security. Ideal for business and extended stays."
  });

  const { data: rooms, isLoading } = useRooms();
  const { data: settings, isLoading: isSettingsLoading } = useSettings();

  if (isSettingsLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"/>
      </div>
    );
  }

  const heroImage = getSetting(settings, "hero_image", "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80");
  const heroTitle = getSetting(settings, "hero_title", "Your Home in the Heart of Addis Ababa");
  const heroTitleColor = getSetting(settings, "hero_title_color", "#D4AF37"); // Default to golden
  const heroTitleSize = getSetting(settings, "hero_title_size", "text-6xl md:text-8xl");
  const heroSubtitle = getSetting(settings, "hero_subtitle", "Luxury serviced apartments near Meskel Square — where modern comfort meets Ethiopian warmth.");
  const aboutImage = getSetting(settings, "about_image", "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80");
  const aboutTitle = getSetting(settings, "about_title", "A Stay Defined by Comfort & Class");
  const aboutDesc = getSetting(settings, "about_description", "Whether you're visiting Addis Ababa for business or leisure, Kora Hotel Suites offers a perfect blend of traditional Ethiopian hospitality and modern luxury. Our 18 individually designed apartments in the Kirkos district provide the space, privacy, and amenities that discerning travelers deserve.");

  const roomsSectionTagline = getSetting(settings, "rooms_section_tagline", "CURATED COLLECTION");
  const roomsSectionTitle = getSetting(settings, "rooms_section_title", "Comfortable Residences");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <Navbar />

      <main id="main-content" className="flex-grow">
      {/* Hero Section */}
      <section className="flex flex-col w-full">
        {/* Full Image Block — Cinematic Ken Burns Effect */}
        <div className="relative w-full h-[65vh] md:h-[75vh] 2xl:h-[80vh] overflow-hidden">
          <motion.img 
            src={heroImage}
            alt="Kora Hotel Suites Lobby" 
            className="w-full h-full object-cover"
            fetchPriority="high"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/5 pointer-events-none" />
        </div>

        {/* Text Block Completely Below the Image */}
        <div className="w-full bg-background pt-16 pb-24 md:py-24 border-b border-border/50 shadow-sm relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center px-4 max-w-5xl mx-auto space-y-8"
          >
            <motion.h1 
              variants={itemVariants} 
              className={`${heroTitleSize} font-serif font-bold leading-[1.1] tracking-tight`}
              style={{ color: heroTitleColor === "#ffffff" || heroTitleColor === "#fff" || heroTitleColor === "white" ? "inherit" : heroTitleColor }}
            >
              <span className={heroTitleColor === "#ffffff" || heroTitleColor === "#fff" || heroTitleColor === "white" ? "text-primary" : ""}>
                {heroTitle}
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              {heroSubtitle}
            </motion.p>
            
            <motion.div variants={itemVariants} className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
              <Link href="/rooms">
                <Button size="lg" className="bg-primary text-white hover:bg-accent px-10 py-8 text-xl font-bold tracking-widest rounded-xl transition-all duration-500 shadow-xl shadow-primary/10 uppercase">
                  Reserve Your Stay
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 px-10 py-8 text-xl font-bold tracking-widest rounded-xl transition-all duration-500 uppercase">
                  Explore Gallery
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-secondary/50 border-y border-border/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Apartment-Style Suites",
                description: "Fully furnished modern suites sized like apartments — with equipped kitchens, living rooms, private laundry, and space for short or long stays.",
                icon: <HomeIcon size={32} />,
                href: "/rooms"
              },
              {
                title: "Next to Dembel Square",
                description: "10 minutes from Bole Airport. Near Friendship Park, Unity Park, ECA, the Marriott, and the Hyatt Regency.",
                icon: <MapPin size={32} />,
                href: "/about"
              },
              {
                title: "Secure Fenced Compound",
                description: "Secure, fenced compound with reliable 24/7 security, free parking, concierge, and daily housekeeping.",
                icon: <Shield size={32} />,
                href: "/contact"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={item.href}>
                  <div className="group bg-white h-full p-10 rounded-2xl border border-border/50 hover:border-primary/20 text-center hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-all duration-500 group-hover:bg-primary/10 group-hover:scale-125" />
                    <div className="relative text-primary bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-primary mb-4">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-32 bg-background">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-2 block">{roomsSectionTagline}</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary">{roomsSectionTitle}</h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/rooms">
                <Button variant="link" className="text-primary hover:text-accent p-0 flex items-center gap-3 text-lg font-bold group">
                  Explore All Suites <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((n) => (
                <div key={n} className="aspect-[4/5] bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {rooms?.slice(0, 3).map((room, i) => (
                <motion.div
                   key={room.id}
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Experience / About Section */}
      <section className="py-32 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent rounded-full blur-[120px]" />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className="text-5xl md:text-7xl font-serif leading-[1.1] font-bold">
                {aboutTitle.includes("&") ? (
                  <>{aboutTitle.split("&")[0]}<br/><span className="text-accent italic font-normal">&{aboutTitle.split("&")[1]}</span></>
                ) : aboutTitle}
              </h2>
              <p className="text-white/70 text-xl font-light leading-relaxed max-w-xl">
                {aboutDesc}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "High-Speed WiFi",
                  "Free Parking",
                  "Fully Equipped Kitchens",
                  "Private Laundry Machine",
                  "Spa & Wellness",
                  "Concierge & Event Room",
                  "Workspace & Iron/Board",
                  "Non-Smoking Rooms"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <CheckCircle className="text-accent shrink-0" size={24} />
                    <span className="font-semibold text-sm tracking-wide">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/gallery">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white mt-4 rounded-xl h-16 px-12 text-lg font-bold tracking-widest uppercase transition-all duration-300">
                  Visual Tour
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-6 border border-accent/20 rounded-2xl group-hover:scale-105 transition-transform duration-700" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={aboutImage}
                  alt="Hotel Apartment" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-24 bg-secondary/50 border-y border-border/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-2 block">VALUE FOR YOUR STAY</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary">Special Offers</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Weekly Rate", discount: "5% OFF", description: "Stay 7+ nights and save on your weekly booking" },
              { label: "Monthly Rate", discount: "10% OFF", description: "Extended stays of 30+ nights at reduced rates" },
              { label: "Yearly Special", discount: "30% OFF", description: "Long-term residents enjoy our best value" },
              { label: "Early Bird", discount: "5% OFF", description: "Book 1 month in advance online and save" },
            ].map((offer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-border/50 text-center hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group"
              >
                <div className="text-accent text-4xl font-serif font-bold mb-3 group-hover:scale-110 transition-transform duration-500">{offer.discount}</div>
                <h3 className="text-xl font-serif font-bold text-primary mb-2">{offer.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{offer.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      </main>

      <Footer />
    </div>
  );
}
