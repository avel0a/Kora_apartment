import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSettings, getSetting } from "@/hooks/use-settings";
import { motion, AnimatePresence } from "framer-motion";

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

  const siteName = getSetting(settings, "site_name", "PANDA");
  const siteSubtitle = getSetting(settings, "site_subtitle", "Hotel Apartments");
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
    { href: "/rooms", label: "Rooms & Suites" },
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
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "top-4 px-4" 
          : "top-0"
      }`}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-2 rounded z-[60]">
        Skip to main content
      </a>
      <div 
        className={`container-custom flex justify-between items-center transition-all duration-500 ${
          scrolled 
            ? "glass shadow-lg py-3 rounded-2xl max-w-6xl" 
            : "bg-transparent py-6"
        }`}
      >
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group hover:scale-105 transition-transform duration-300">
            {companyLogo && (
              <img src={companyLogo} alt={siteName} className="h-16 md:h-20 w-auto object-contain" />
            )}
            <div className="flex flex-col items-center">
              <span className="text-2xl font-serif font-bold tracking-[0.2em] text-primary group-hover:text-accent transition-colors duration-300">
                {siteName.toUpperCase()}
              </span>
              <div className="h-[1px] w-0 group-hover:w-full bg-accent transition-all duration-300" />
              <span className="text-[9px] font-sans font-medium text-primary/70 tracking-[0.4em] uppercase mt-1">
                {siteSubtitle}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span 
                  onMouseEnter={() => handlePrefetch(link.href)}
                  className="relative group cursor-pointer text-sm font-medium tracking-widest transition-colors"
                >
                  <span className={`${
                    isActive(link.href) 
                      ? "text-primary font-bold" 
                      : scrolled ? "text-foreground" : "text-white md:text-white lg:text-white"
                  } group-hover:text-accent transition-colors duration-300 uppercase`}>
                    {link.label}
                  </span>
                  <span className={`absolute -bottom-1 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full ${isActive(link.href) ? "w-full" : ""}`} />
                </span>
              </Link>
            ))}
          </div>
          
          <Link href="/rooms">
            <Button className="btn-primary rounded-xl px-8 py-5 text-sm font-bold tracking-widest uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/20">
              Book Now
            </Button>
          </Link>
          
          <Link href="/admin">
            <span className={`text-[10px] font-bold tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-pointer ml-4 uppercase ${scrolled ? "text-foreground" : "text-white"}`}>
              Admin
            </span>
          </Link>
        </div>

        <button
          className={`${scrolled ? "text-foreground" : "text-white"} md:hidden hover:scale-110 active:scale-90 transition-transform`}
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
