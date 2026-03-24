import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, Loader2 } from "lucide-react";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useSettings, getSetting } from "@/hooks/use-settings";

export default function Contact() {
  const { toast } = useToast();
  const { data: settings } = useSettings();

  const address = getSetting(settings, "contact_address", "Bole Road, Addis Ababa, Ethiopia");
  const phone = getSetting(settings, "contact_phone", "+251 116 123 456");
  const email = getSetting(settings, "contact_email", "info@pandahotel.com");
  const latitude = getSetting(settings, "map_latitude", "9.0054");
  const longitude = getSetting(settings, "map_longitude", "38.7893");
  const facebookUrl = getSetting(settings, "facebook_url", "#");
  const instagramUrl = getSetting(settings, "instagram_url", "#");
  const twitterUrl = getSetting(settings, "twitter_url", "#");
  const tiktokUrl = getSetting(settings, "tiktok_url", "#");

  const form = useForm({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Cinematic Header */}
      <section className="relative pt-48 pb-24 overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--accent)_1px,_transparent_1px)] bg-[size:40px_40px]" />
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Connect With Us</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              We're here to ensure your stay is extraordinary. Reach out for reservations, events, or inquiries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-background flex-grow">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Info */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-4xl font-serif font-bold text-primary mb-6 text-gradient inline-block">Contact Information</h2>
                <p className="text-muted-foreground text-lg leading-relaxed font-light">
                  Located in the heart of the vibrant Bole district, Panda Hotel is your gateway to Addis Ababa's finest experiences.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: <MapPin className="text-accent" />, label: "Location", value: address },
                  { icon: <Phone className="text-accent" />, label: "Phone", value: phone },
                  { icon: <Mail className="text-accent" />, label: "Email", value: email }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="bg-secondary/50 p-4 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm leading-none">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1 block">{item.label}</span>
                      <p className="text-xl font-medium text-primary">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-border/50">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground mb-6 block">Follow Our Journey</span>
                <div className="flex gap-4">
                  {[
                    { icon: <Instagram size={20} />, url: instagramUrl },
                    { icon: <Facebook size={20} />, url: facebookUrl },
                    { icon: <Twitter size={20} />, url: twitterUrl },
                    { icon: <TikTokIcon size={20} />, url: tiktokUrl },
                  ].map((item, i) => (
                    <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="bg-primary/5 p-4 rounded-xl text-primary hover:bg-primary hover:text-white transition-all duration-300">
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-10 md:p-12 rounded-3xl shadow-2xl border-white/40"
            >
              <h3 className="text-3xl font-serif font-bold text-primary mb-8">Send a Message</h3>
              <form 
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground ml-1">Your Name</label>
                    <Input 
                      {...form.register("name")} 
                      placeholder="John Doe" 
                      className="rounded-xl border-border/50 focus:border-primary/30 h-14 bg-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground ml-1">Email Address</label>
                    <Input 
                      {...form.register("email")} 
                      type="email" 
                      placeholder="john@example.com" 
                      className="rounded-xl border-border/50 focus:border-primary/30 h-14 bg-white/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground ml-1">Subject</label>
                  <Input 
                    {...form.register("subject")} 
                    placeholder="Reservation Inquiry" 
                    className="rounded-xl border-border/50 focus:border-primary/30 h-14 bg-white/50"
                  />
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground ml-1">Your Message</label>
                  <Textarea 
                    {...form.register("message")} 
                    placeholder="How can we help you?" 
                    className="rounded-xl border-border/50 focus:border-primary/30 min-h-[160px] bg-white/50"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="w-full btn-primary h-16 rounded-xl text-lg font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  {mutation.isPending ? (
                    <><Loader2 className="animate-spin" size={20} /> Sending...</>
                  ) : (
                    <>Send Message <Send size={20} /></>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Embed */}
      <section className="h-[500px] w-full relative grayscale hover:grayscale-0 transition-all duration-1000">
        <iframe
          title="Panda Hotel Location"
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute inset-0 pointer-events-none border-y border-border/50 shadow-inner" />
      </section>

      <Footer />
    </div>
  );
}
