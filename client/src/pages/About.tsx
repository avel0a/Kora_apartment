import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSettings, getSetting } from "@/hooks/use-settings";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { CheckCircle, MapPin, Shield, Clock, Users, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  useSEO({
    title: "About Us | Kora Hotel Suites, Addis Ababa",
    description: "Learn about Kora Hotel Suites — 18 individually designed serviced apartments in Kirkos, Addis Ababa. Apartment-style living with hotel service since day one."
  });

  const { data: settings } = useSettings();

  const headerImage = getSetting(settings, "about_header_image", "");
  const headerTagline = getSetting(settings, "about_header_tagline", "Our Story");
  const headerTitle = getSetting(settings, "about_header_title", "About Kora Hotel Suites");
  const headerSubtitle = getSetting(settings, "about_header_subtitle", "Where apartment-style living meets world-class hospitality in the heart of Addis Ababa.");

  const storyTitle = getSetting(settings, "about_story_title", "Born from a Simple Belief");
  const storyP1 = getSetting(settings, "about_story_p1", "Kora Hotel Suites was born from a simple belief: travelers to Addis Ababa deserve more than a hotel room. They deserve a home.");
  const storyP2 = getSetting(settings, "about_story_p2", 'In Amharic, "Kora" evokes a sense of pride and stature — and that is precisely the standard we hold ourselves to. From the moment our doors opened in the Kirkos neighborhood, we set out to redefine what a serviced apartment in Addis Ababa could be: not merely a furnished flat, but a carefully considered living space where every fixture, every fabric, and every service anticipates our guests\' needs.');
  const storyImage = getSetting(settings, "about_story_image", "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80");

  const philosophyTitle = getSetting(settings, "about_philosophy_title", "Our Philosophy");
  const philosophyP1 = getSetting(settings, "about_philosophy_p1", "We believe that true comfort is not about excess — it is about thoughtfulness. A kitchen stocked with the right tools. A living room that feels like yours. A front desk team that remembers your name and your preferences.");
  const philosophyP2 = getSetting(settings, "about_philosophy_p2", "At Kora, we combine the independence of apartment living with the reliability of hotel service, creating an experience that feels personal rather than transactional.");

  const locationTitle = getSetting(settings, "about_location_title", "Our Location");
  const locationDesc = getSetting(settings, "about_location_desc", "Positioned on Democratic Republic of Congo Road in the heart of the Kirkos district, Kora Hotel Suites sits within walking distance of Meskel Square, the United Nations Economic Commission for Africa (UNECA), the Red Terror Martyrs' Memorial Museum, and Africa Hall. We are 15 minutes from Bole International Airport and surrounded by Addis Ababa's finest dining, shopping, and cultural landmarks.");
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
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">{headerTitle}</h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
                {headerSubtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
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
                  <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-3 block">Our Story</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">{storyTitle}</h2>
                </div>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  {storyP1}
                </p>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  {storyP2}
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
                    alt="Kora Hotel Suites Interior" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
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
                <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-3 block">Our Approach</span>
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

            {/* Why Choose Us Grid */}
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
                  description: "Every suite is a complete apartment — with a kitchen, living room, and space to live on your own terms. Plus daily housekeeping and concierge."
                },
                {
                  icon: <Clock size={28} />,
                  title: "Built for Extended Stays",
                  description: "Purpose-built apartments with in-unit kitchens, washing machines, and generous storage. Settle in properly — not out of a suitcase."
                },
                {
                  icon: <MapPin size={28} />,
                  title: "Central Without the Chaos",
                  description: "Kirkos is one of Addis Ababa's most connected neighborhoods — yet our property offers a tranquil, secure environment."
                },
                {
                  icon: <Sparkles size={28} />,
                  title: "Exceptional Value",
                  description: "Premium apartment-style accommodation with parking, Wi-Fi, and security included — often below comparable international hotels."
                },
                {
                  icon: <Shield size={28} />,
                  title: "24/7 Security & Privacy",
                  description: "Round-the-clock security personnel, controlled access, and CCTV surveillance. Your safety is our first priority."
                },
                {
                  icon: <CheckCircle size={28} />,
                  title: "Genuine Ethiopian Hospitality",
                  description: "Our team follows a tradition, not a script. Sincere, generous, and personal service from check-in to check-out."
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

        {/* Location Section */}
        <section className="py-24 md:py-32 bg-background">
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
                    alt="Kora Hotel Suites Location" 
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
                    { name: "Meskel Square", distance: "~5 min walk" },
                    { name: "UNECA / Africa Hall", distance: "~10 min walk" },
                    { name: "Bole International Airport", distance: "~15 min drive" },
                    { name: "National Museum", distance: "~15 min drive" },
                  ].map((landmark, i) => (
                    <div key={i} className="flex items-center gap-4 bg-secondary/50 p-4 rounded-xl border border-border/50">
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
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Reserve your suite and discover why discerning travelers choose apartment-style luxury in the heart of Addis Ababa.
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
