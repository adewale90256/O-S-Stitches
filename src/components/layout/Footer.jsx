import { Link } from "react-router-dom";
import { MessageCircle, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Catalogue", path: "/catalogue" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

function Footer() {
  return (
    <footer className="bg-[#06151b] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80">
                <span className="font-serif text-lg leading-none tracking-[-0.08em]">
                  OS
                </span>
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold tracking-[0.18em]">
                  O-S
                </span>

                <span className="mt-1 text-[8px] tracking-[0.3em] text-white/50">
                  STITCHES
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-6 text-white/55">
              Bespoke fashion designed around you. We create timeless, carefully
              crafted pieces that reflect your style and occasion.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[#d7ad55] hover:text-[#d7ad55]"
              >
                IG
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[#d7ad55] hover:text-[#d7ad55]"
              >
                Facebook
              </a>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[#d7ad55] hover:text-[#d7ad55]"
              >
                <MessageCircle size={15} strokeWidth={1.7} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d7ad55]">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/55 transition hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d7ad55]">
              What We Do
            </h3>

            <ul className="mt-5 space-y-3">
              <li className="text-sm text-white/55">Bespoke Fashion</li>

              <li className="text-sm text-white/55">Traditional Wear</li>

              <li className="text-sm text-white/55">Wedding Outfits</li>

              <li className="text-sm text-white/55">Senator Wear</li>

              <li className="text-sm text-white/55">Custom Designs</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d7ad55]">
              Get In Touch
            </h3>

            <div className="mt-5 space-y-4">
              {/* WhatsApp */}
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3"
              >
                <MessageCircle
                  size={16}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#d7ad55]"
                />

                <div>
                  <p className="text-xs font-medium text-white">WhatsApp</p>
                  <p className="mt-0.5 text-xs text-white/45 transition group-hover:text-white/70">
                    Chat with us
                  </p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+2340000000000"
                className="group flex items-start gap-3"
              >
                <Phone
                  size={16}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#d7ad55]"
                />

                <div>
                  <p className="text-xs font-medium text-white">Phone</p>
                  <p className="mt-0.5 text-xs text-white/45 transition group-hover:text-white/70">
                    +234 000 000 0000
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@osstitches.com"
                className="group flex items-start gap-3"
              >
                <Mail
                  size={16}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#d7ad55]"
                />

                <div>
                  <p className="text-xs font-medium text-white">Email</p>
                  <p className="mt-0.5 text-xs text-white/45 transition group-hover:text-white/70">
                    info@osstitches.com
                  </p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-[#d7ad55]"
                />

                <div>
                  <p className="text-xs font-medium text-white">Location</p>
                  <p className="mt-0.5 text-xs text-white/45">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
          <div className="flex flex-col items-start justify-between gap-6 px-6 py-7 sm:flex-row sm:items-center lg:px-8">
            <div>
              <p className="font-serif text-xl text-white sm:text-2xl">
                Ready to create something unique?
              </p>

              <p className="mt-1.5 text-sm text-white/45">
                Let's bring your fashion ideas to life.
              </p>
            </div>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[#d7ad55] px-5 py-3 text-xs font-semibold text-[#06151b] transition hover:bg-[#e5c275]"
            >
              <MessageCircle size={15} />
              Chat on WhatsApp
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center sm:flex-row sm:text-left lg:px-8">
          <p className="text-[11px] text-white/35">
            © {new Date().getFullYear()} O-S STITCHES. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-[11px] text-white/35">
            <Link to="/" className="transition hover:text-white/70">
              Privacy Policy
            </Link>

            <Link to="/" className="transition hover:text-white/70">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
