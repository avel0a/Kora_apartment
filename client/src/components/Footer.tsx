import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { useSettings, getSetting } from "@/hooks/use-settings";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function Footer() {
  const { data: settings } = useSettings();

  const address = getSetting(settings, "contact_address", "Bole Road, Addis Ababa, Ethiopia");
  const phone = getSetting(settings, "contact_phone", "+251 11 661 0404");
  const email = getSetting(settings, "contact_email", "info@korahotelsuites.com");
  const facebookUrl = getSetting(settings, "facebook_url", "#");
  const instagramUrl = getSetting(settings, "instagram_url", "#");
  const twitterUrl = getSetting(settings, "twitter_url", "#");
  const tiktokUrl = getSetting(settings, "tiktok_url", "#");
  const siteName = getSetting(settings, "site_name", "KORA");
  const siteSubtitle = getSetting(settings, "site_subtitle", "Hotel Suites");
  const companyLogo = getSetting(settings, "company_logo", "");
  const footerDescription = getSetting(settings, "footer_description", "Experience luxury and comfort in the heart of Addis Ababa. Just minutes from Bole International Airport.");

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {companyLogo && (
              <img src={companyLogo} alt={siteName} className="h-12 w-auto object-contain" />
            )}
            <div className="text-2xl font-serif font-bold text-white tracking-widest uppercase">
              {siteName}
            </div>
          </div>
          <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs">
            {footerDescription}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-serif mb-6 text-accent">Discover</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/rooms" className="hover:text-white transition-colors">Rooms & Suites</Link></li>
            <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-serif mb-6 text-accent">Contact</h4>
          <ul className="space-y-4 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent shrink-0" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-accent shrink-0" />
              <span>{phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent shrink-0" />
              <span>{email}</span>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-lg font-serif mb-6 text-accent">Follow Us</h4>
          <div className="flex gap-4">
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Facebook className="w-5 h-5" />
            </a>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <Twitter className="w-5 h-5" />
            </a>
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
              <TikTokIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="container-custom pt-8 border-t border-white/10 text-center text-sm text-primary-foreground/60">
        <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
