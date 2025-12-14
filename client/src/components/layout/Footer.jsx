import { Link } from "wouter";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0077FF] to-[#00C2FF] flex items-center justify-center">
                <span className="text-white font-bold text-lg font-[Poppins]">P</span>
              </div>
              <span className="font-[Poppins] font-semibold text-xl text-foreground">
                Pulito Wash
              </span>
            </div>
            <p className="text-muted-foreground font-[Inter] text-sm leading-relaxed">
              Premium laundry services at your doorstep. We handle your clothes with care
              and deliver them fresh and clean.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover-elevate"
                data-testid="link-facebook"
              >
                <Facebook className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover-elevate"
                data-testid="link-twitter"
              >
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover-elevate"
                data-testid="link-instagram"
              >
                <Instagram className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-[Poppins] font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/pricing", label: "Pricing" },
                { href: "/booking", label: "Book Now" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground font-[Inter] text-sm transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[Poppins] font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {["Wash & Fold", "Wash & Iron", "Dry Cleaning", "Premium Wash"].map(
                (service) => (
                  <li key={service}>
                    <Link
                      href="/services"
                      className="text-muted-foreground hover:text-foreground font-[Inter] text-sm transition-colors"
                    >
                      {service}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-[Poppins] font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#0077FF] flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-[Inter] text-sm">
                  123 Clean Street, Laundry District,
                  <br />
                  Mumbai, MH 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#0077FF] flex-shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-muted-foreground hover:text-foreground font-[Inter] text-sm transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#0077FF] flex-shrink-0" />
                <a
                  href="mailto:hello@pulitowash.com"
                  className="text-muted-foreground hover:text-foreground font-[Inter] text-sm transition-colors"
                >
                  hello@pulitowash.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground font-[Inter] text-sm">
            © {new Date().getFullYear()} Pulito Wash. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground font-[Inter] text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground font-[Inter] text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
