import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="space-y-4">
          <div className="text-2xl font-serif font-bold text-white tracking-widest">
            MOMONA
          </div>
          <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs">
            Experience luxury and comfort in the heart of Addis Ababa. Just minutes from Bole International Airport.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-serif mb-6 text-accent">Discover</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/rooms" className="hover:text-white transition-colors">Rooms & Suites</Link></li>
            <li><Link href="/amenities" className="hover:text-white transition-colors">Dining & Spa</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-serif mb-6 text-accent">Contact</h4>
          <ul className="space-y-4 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent shrink-0" />
              <span>Bole Road, Addis Ababa, Ethiopia<br/>(3 mins from Airport)</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-accent shrink-0" />
              <span>+251 11 661 0404</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent shrink-0" />
              <span>info@momonahotel.com</span>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-lg font-serif mb-6 text-accent">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="container-custom pt-8 border-t border-white/10 text-center text-sm text-primary-foreground/60">
        <p>&copy; {new Date().getFullYear()} Momona Hotel. All rights reserved.</p>
      </div>
    </footer>
  );
}
