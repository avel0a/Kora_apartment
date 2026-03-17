import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSettings, getSetting } from "@/hooks/use-settings";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { data: settings } = useSettings();

  const siteName = getSetting(settings, "site_name", "MOMONA");
  const siteSubtitle = getSetting(settings, "site_subtitle", "Hotel Apartments");

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

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <div className="text-2xl font-serif font-bold text-primary cursor-pointer flex flex-col items-center leading-none">
            <span className="tracking-widest">{siteName.toUpperCase()}</span>
            <span className="text-[10px] font-sans text-primary/80 tracking-[0.3em] uppercase mt-1">
              {siteSubtitle}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`cursor-pointer text-sm font-medium tracking-wide transition-colors hover:text-accent ${
                  isActive(link.href) 
                    ? "text-primary font-semibold" 
                    : scrolled ? "text-foreground" : "text-foreground/90 md:text-white lg:text-foreground" // Handle hero overlap text color if needed, simplified here to generally readable
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
          <Link href="/rooms">
            <Button className="btn-primary rounded-none px-6 font-serif">
              Book Now
            </Button>
          </Link>
          <Link href="/admin">
            <span className="text-xs font-medium text-muted-foreground hover:text-primary cursor-pointer ml-2">
              Admin
            </span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className="block text-lg font-medium py-2 text-foreground/80 hover:text-primary cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </span>
            </Link>
          ))}
          <Link href="/rooms">
            <Button className="w-full btn-primary mt-2" onClick={() => setIsOpen(false)}>
              Book Your Stay
            </Button>
          </Link>
          <Link href="/admin">
            <span
               className="block text-sm font-medium py-2 text-muted-foreground hover:text-primary cursor-pointer border-t pt-4 mt-2"
               onClick={() => setIsOpen(false)}
            >
              Admin Access
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
}
