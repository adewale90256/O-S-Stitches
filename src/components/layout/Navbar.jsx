import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search, MessageCircle } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Catalogue", path: "/catalogue" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#06151b] text-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex shrink-0 items-center gap-2"
        >
          {/* OS Mark */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80">
            <span className="font-serif text-[15px] leading-none tracking-[-0.08em]">
              OS
            </span>
          </div>

          {/* Brand Name */}
          <div className="flex flex-col leading-none">
            <span className="text-[9px] font-semibold tracking-[0.16em] text-white">
              O-S
            </span>
            <span className="mt-0.5 text-[6px] tracking-[0.25em] text-white/60">
              STITCHES
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-7">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative py-5 text-[10px] font-medium transition-colors lg:text-[11px] ${
                  isActive ? "text-white" : "text-white/65 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}

                  {isActive && (
                    <span className="absolute bottom-2 left-0 h-px w-full bg-[#d7ad55]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-1.5 md:flex">
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <Search size={14} strokeWidth={1.8} />
          </button>

          {/* WhatsApp Icon */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <MessageCircle size={14} strokeWidth={1.8} />
          </a>

          {/* Contact Button */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="ml-1 flex items-center rounded-md bg-[#d7ad55] px-3.5 py-2 text-[9px] font-semibold text-[#06151b] transition hover:bg-[#e5c275]"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-white hover:bg-white/10 md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X size={21} strokeWidth={1.8} />
          ) : (
            <Menu size={21} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#06151b] md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `border-b border-white/10 py-3.5 text-xs font-medium ${
                    isActive ? "text-white" : "text-white/60"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-md bg-[#d7ad55] px-5 py-3 text-xs font-semibold text-[#06151b]"
            >
              <MessageCircle size={15} />
              Contact Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
