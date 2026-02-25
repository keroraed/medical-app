import { Link } from "react-router-dom";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  ArrowUpRight,
} from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Find Doctors", href: "/doctors" },
    { label: "Book Appointment", href: "/login" },
    { label: "Specialties", href: "/doctors" },
    { label: "How It Works", href: "/" },
  ],
  support: [
    { label: "Help Center", href: "/" },
    { label: "Terms of Service", href: "/" },
    { label: "Privacy Policy", href: "/" },
    { label: "Contact Us", href: "/" },
  ],
  forDoctors: [
    { label: "Join as Doctor", href: "/register" },
    { label: "Doctor Dashboard", href: "/login" },
    { label: "Manage Schedule", href: "/login" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 mt-auto">
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background">
                MedAppoint
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-background/60 mb-5">
              Your trusted healthcare companion. Book appointments with top
              doctors, manage your health records, and take control of your
              wellness journey.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-background/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-semibold text-background text-sm uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/60 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="font-semibold text-background text-sm uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/60 hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold text-background text-sm uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/60">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>ITI , Asyut, Egypt</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+20 100 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@medappoint.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Sun - Thu: 9AM - 6PM</span>
              </li>
            </ul>

            {/* Newsletter mini */}
            <div className="mt-5">
              <p className="text-xs text-background/50 mb-2">Stay updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-background/10 border border-background/20 rounded-lg px-3 py-2 text-xs text-background placeholder:text-background/40 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors shrink-0">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
