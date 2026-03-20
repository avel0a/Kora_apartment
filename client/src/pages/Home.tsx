import { Link } from "wouter";
import { ArrowRight, Star, MapPin, CheckCircle, Home as HomeIcon, Shield, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/components/RoomCard";
import { useRooms } from "@/hooks/use-rooms";
import { useSettings, getSetting } from "@/hooks/use-settings";
import { motion } from "framer-motion";

export default function Home() {
  const { data: rooms, isLoading } = useRooms();
  const { data: settings } = useSettings();

  const heroImage = getSetting(settings, "hero_image", "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80");
  const heroTitle = getSetting(settings, "hero_title", "Luxury in the Heart of Addis Ababa");
  const heroSubtitle = getSetting(settings, "hero_subtitle", "Experience Ethiopian hospitality redefined. Just 3 minutes from Bole International Airport.");
  const aboutImage = getSetting(settings, "about_image", "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80");
  const aboutTitle = getSetting(settings, "about_title", "A Stay Defined by Comfort & Class");
  const aboutDesc = getSetting(settings, "about_description", "Whether you're visiting Addis Ababa for business or leisure, Momona Hotel offers a perfect blend of traditional Ethiopian hospitality and modern luxury.");

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

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={heroImage}
            alt="Momona Hotel Lobby" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto space-y-8"
        >
          {/* <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 text-accent">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="fill-current" size={18} />
            ))}
          </motion.div> */}
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-serif font-bold leading-[1.1] tracking-tight">
            {heroTitle.includes("Addis Ababa") ? (
              <>Luxury in the <br/> <span className="text-accent italic font-normal">Heart of Addis</span></>
            ) : heroTitle}
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
            {heroSubtitle}
          </motion.p>
          
          <motion.div variants={itemVariants} className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/rooms">
              <Button size="lg" className="bg-white text-primary hover:bg-accent hover:text-white px-10 py-8 text-xl font-bold tracking-widest rounded-xl transition-all duration-500 shadow-2xl shadow-black/20 uppercase">
                Reserve Your Stay
              </Button>
            </Link>
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-10 py-8 text-xl font-bold tracking-widest rounded-xl backdrop-blur-sm transition-all duration-500 uppercase">
                Explore Gallery
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 bg-secondary/50 border-y border-border/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Exquisite Living",
                description: "Experience unparalleled comfort in our fully furnished designer apartments.",
                icon: <HomeIcon size={32} />,
                href: "/rooms"
              },
              {
                title: "Prime Bole Hub",
                description: "The city's finest dining, shopping, and nightlife right at your doorstep.",
                icon: <MapPin size={32} />,
                href: "/contact"
              },
              {
                title: "Elite Concierge",
                description: "Bespoke 24/7 services tailored to your every need and desire.",
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
              <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-2 block">CURATED COLLECTION</span>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-primary">Luxury Residences</h2>
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
                  "Gigabit Speed WiFi",
                  "24/7 Elite Service",
                  "Airport VIP Shuttle",
                  "Gourmet Kitchenettes"
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
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
