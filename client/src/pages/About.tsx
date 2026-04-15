import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSettings, getSetting } from "@/hooks/use-settings";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { CheckCircle, MapPin, Shield, Clock, Users, Sparkles, Music, Palette, CalendarHeart, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  useSEO({
    title: "About Us | Kora Hotel Suites — The Soul of Elegance, Addis Ababa",
    description: "Named after the kora — a timeless West African harp — Kora Hotel Suites blends modern luxury with cultural soul. Boutique suites near Dembel Square, enriched with African art."
  });

  const { data: settings } = useSettings();

  const headerImage = getSetting(settings, "about_header_image", "");
  const headerTagline = getSetting(settings, "about_header_tagline", "Our Story");
  const headerTitle = getSetting(settings, "about_header_title", "The Soul of Elegance");
  const headerSubtitle = getSetting(settings, "about_header_subtitle", "The Sound of Home.");

  const storyTitle = getSetting(settings, "about_story_title", "A Name Inspired by Culture");
  const storyP1 = getSetting(settings, "about_story_p1", "The Kora Hotel Suites takes its name from the kora — a timeless West African harp known for its graceful form and rich, resonant sound. Crafted with care and played with soul, the kora embodies balance, beauty, and tradition. These are the values we bring to life within our walls.");
  const storyP2 = getSetting(settings, "about_story_p2", "Throughout the hotel, you'll discover original pieces of African artifacts. Each piece is more than art; it is a tribute to identity, crafted with soul and intention. Here, every suite is a private retreat — designed with subtle luxury and layered with meaning. The Kora is not simply a place to stay. It is a place to feel, reflect, and remember.");
  const storyImage = getSetting(settings, "about_story_image", "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80");

  const philosophyTitle = getSetting(settings, "about_philosophy_title", "Where Your Journey Finds Its Rhythm");
  const philosophyP1 = getSetting(settings, "about_philosophy_p1", "At The Kora, every suite is thoughtfully composed — where modern comfort meets cultural depth, and every detail hums in quiet harmony. Like the instrument that inspires us, we believe true luxury lies in subtlety, warmth, and unforgettable resonance.");
  const philosophyP2 = getSetting(settings, "about_philosophy_p2", "The family members who manage the business worked together to design the hotel with elegant African artifacts. Every suite has a spacious space that can accommodate both short-term and long-term guests, and it is completely furnished. Kora Hotel Suites is your home — not simply a place to visit.");

  const locationTitle = getSetting(settings, "about_location_title", "Our Location");
  const locationDesc = getSetting(settings, "about_location_desc", "The Kora Hotel Suites is a modern boutique hotel next to Dembel Square, 10 minutes' drive from the Bole International Airport of Addis Ababa. Its great location allows easy access to major commercial areas, shopping centres, and entertainment sites. Friendship Park, Unity Park, the Science and Technology Museum, the Economic Commission of Africa (ECA), the Marriott Hotel, and the Hyatt Regency Hotel are all conveniently in the vicinity.");
  const locationImage = getSetting(settings, "about_location_image", "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-grow flex flex-col">
        {/* Cinematic Header */}
        <section className="relative pt-48 pb-24 overflow-hidden text-white bg-primary">
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
              <span className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-4 block">{headerTagline}</span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">{headerTitle}</h1>
              <p className="text-3xl md:text-4xl text-accent/80 font-serif italic mb-6">
                {headerSubtitle}
              </p>
              <p className="text-lg text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                Named after the kora — a revered West African harp — our hotel is crafted to create harmony between tradition and modernity, comfort and culture.
              </p>
            </motion.div>
          </div>
        </section>

        {/* The Kora Story */}
        <section className="py-24 md:py-32 bg-background">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-3 block">The Kora Instrument</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">{storyTitle}</h2>
                </div>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  {storyP1}
                </p>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  {storyP2}
                </p>
                <p className="text-lg text-primary font-serif italic leading-relaxed border-l-4 border-accent pl-6">
                  "Here, you don't just hear the rhythm of Africa — you live it."
                </p>
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
                    src={storyImage}
                    alt="The Kora — West African Harp" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Philosophy & Culture */}
        <section className="py-24 md:py-32 bg-primary text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent rounded-full blur-[120px]" />
          </div>

          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">{philosophyTitle}</h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto"
              >
                {philosophyP1}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto"
              >
                {philosophyP2}
              </motion.p>
            </div>

            {/* Why Choose Kora Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20"
            >
              {[
                {
                  icon: <Users size={28} />,
                  title: "Apartment Living, Hotel Service",
                  description: "Every suite is a complete apartment — with a kitchen, living room, private laundry, and space to live on your own terms. Plus concierge and daily housekeeping."
                },
                {
                  icon: <Clock size={28} />,
                  title: "Built for Short & Long Stays",
                  description: "Purpose-built apartments with in-unit kitchens, private washing machines, and generous storage. Whether one night or one year — settle in properly."
                },
                {
                  icon: <Palette size={28} />,
                  title: "African Art & Cultural Soul",
                  description: "The hotel's décor is enriched with African artifacts, giving it a unique and authentic ambiance. Each piece is a tribute to identity, crafted with soul."
                },
                {
                  icon: <MapPin size={28} />,
                  title: "Next to Dembel Square",
                  description: "Easy access to commercial areas, shopping, and entertainment. Friendship Park, Unity Park, the ECA, the Marriott, and Hyatt Regency are all nearby."
                },
                {
                  icon: <Shield size={28} />,
                  title: "Secure Fenced Compound",
                  description: "Known for its secure, fenced compound and reliable security measures. Your safety is our first priority — round-the-clock."
                },
                {
                  icon: <Sparkles size={28} />,
                  title: "Exceptional Value",
                  description: "Weekly 5% off, monthly 10% off, yearly 30% off. Premium apartment-style living with parking, WiFi, and security included."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/10 transition-all duration-500"
                >
                  <div className="text-accent mb-5">{item.icon}</div>
                  <h3 className="text-xl font-serif font-bold mb-3">{item.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Events & Wellness */}
        <section className="py-24 md:py-32 bg-background">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Events */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-secondary/50 border border-border/50 rounded-2xl p-10 md:p-12 space-y-6"
              >
                <div className="text-primary bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                  <CalendarHeart size={32} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-primary">Events & Gatherings</h3>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  Our small and medium-sized spaces are geared for intimate and private gatherings and celebrations — birthdays, graduations, business meetings, and more. Let us help you create memorable moments in an elegant setting.
                </p>
              </motion.div>

              {/* Wellness */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-secondary/50 border border-border/50 rounded-2xl p-10 md:p-12 space-y-6"
              >
                <div className="text-primary bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                  <Heart size={32} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-primary">Wellness Center</h3>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  At Kora Hotel, your comfort and relaxation are our top priority. Immerse yourself in the soothing atmosphere of our spa — the perfect retreat for unwinding and revitalizing your senses after a long day in the city.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-24 md:py-32 bg-primary/5">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative group order-2 lg:order-1"
              >
                <div className="absolute -inset-6 border border-primary/10 rounded-2xl group-hover:scale-105 transition-transform duration-700" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src={locationImage}
                    alt="Kora Hotel Suites Location near Dembel Square" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    loading="lazy"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8 order-1 lg:order-2"
              >
                <div>
                  <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-3 block">Where We Are</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">{locationTitle}</h2>
                </div>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  {locationDesc}
                </p>

                {/* Landmark Distances */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {[
                    { name: "Dembel Square", distance: "Walking distance" },
                    { name: "Bole International Airport", distance: "~10 min drive" },
                    { name: "Friendship Park", distance: "Nearby" },
                    { name: "Unity Park", distance: "Nearby" },
                    { name: "ECA / Africa Hall", distance: "In the vicinity" },
                    { name: "Marriott & Hyatt Regency", distance: "In the vicinity" },
                  ].map((landmark, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-border/50">
                      <MapPin className="text-accent shrink-0" size={20} />
                      <div>
                        <span className="font-semibold text-primary text-sm">{landmark.name}</span>
                        <p className="text-muted-foreground text-xs">{landmark.distance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-secondary/50 border-y border-border/50">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">Ready to Experience Kora?</h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed italic">
                Elegance inspired by heritage. Luxury in harmony with culture. Crafted with soul. Styled for serenity.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                <Link href="/rooms">
                  <Button size="lg" className="bg-primary text-white hover:bg-accent px-10 py-8 text-xl font-bold tracking-widest rounded-xl transition-all duration-500 shadow-xl shadow-primary/10 uppercase">
                    Browse Suites
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 px-10 py-8 text-xl font-bold tracking-widest rounded-xl transition-all duration-500 uppercase">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
