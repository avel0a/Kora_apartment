import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSettings, getSetting } from "@/hooks/use-settings";
import { motion, AnimatePresence } from "framer-motion";
import { WeatherWidget } from "./WeatherWidget";

const prefetchRoutes: Record<string, () => Promise<any>> = {
  "/": () => import("@/pages/Home"),
  "/rooms": () => import("@/pages/Rooms"),
  "/gallery": () => import("@/pages/Gallery"),
  "/contact": () => import("@/pages/Contact"),
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { data: settings } = useSettings();

  const siteName = getSetting(settings, "site_name", "KORA");
  const siteSubtitle = getSetting(settings, "site_subtitle", "Hotel, Suites & Wellness");
  const companyLogo = getSetting(settings, "company_logo", "");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/rooms", label: "Suites" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location === path;

  const handlePrefetch = (path: string) => {
    const prefetcher = prefetchRoutes[path];
    if (prefetcher) {
      prefetcher().catch(() => {}); // silently catch prefetch errors
    }
  };

  return (
    <motion.nav
      role="navigation"
      aria-label="Main Navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-2 rounded z-[60]">
        Skip to main content
      </a>
      <div className="container-custom flex justify-between items-center py-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group hover:scale-105 transition-transform duration-300">
            {companyLogo && (
              <img src={companyLogo} alt={siteName} className="h-16 md:h-20 w-auto object-contain" />
            )}
            <div className="flex flex-col items-center">
              <span className={`text-2xl font-serif font-bold tracking-[0.2em] transition-colors duration-300 group-hover:text-accent ${scrolled ? 'text-primary' : 'text-white drop-shadow-md'}`}>
                {siteName.toUpperCase()}
              </span>
              <div className="h-[1px] w-0 group-hover:w-full bg-accent transition-all duration-300" />
              <span className={`text-[9px] font-sans font-medium tracking-[0.4em] uppercase mt-1 transition-colors duration-300 ${scrolled ? 'text-primary/70' : 'text-white/90 drop-shadow-md'}`}>
                {siteSubtitle}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <div className="flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span 
                  onMouseEnter={() => handlePrefetch(link.href)}
                  className={`relative group cursor-pointer text-xs font-semibold tracking-[0.2em] transition-colors uppercase hover:text-accent ${scrolled ? 'text-foreground' : 'text-white drop-shadow-md'}`}
                >
                  <span className={`${isActive(link.href) ? (scrolled ? "text-primary" : "text-white") : ""}`}>
                    {link.label}
                  </span>
                  <span className={`absolute -bottom-2 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full ${isActive(link.href) ? "w-full" : ""}`} />
                </span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-6 border-l border-border/50 pl-6">
            <WeatherWidget />
            <Link href="/rooms">
              <Button className="btn-primary rounded-none shadow-none text-[10px] tracking-[0.2em] px-8 py-6 uppercase hover:bg-primary/90 transition-colors">
                Book Now
              </Button>
            </Link>
          </div>
        </div>

        <button
          className={`${scrolled ? 'text-foreground' : 'text-white drop-shadow-md'} md:hidden hover:scale-110 active:scale-90 transition-all`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mx-4 mt-2 overflow-hidden glass rounded-2xl shadow-2xl p-6 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className="block text-xl font-serif font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer border-b border-border/10 pb-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/rooms">
              <Button className="w-full btn-primary rounded-xl py-6 text-lg" onClick={() => setIsOpen(false)}>
                Book Your Stay
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
