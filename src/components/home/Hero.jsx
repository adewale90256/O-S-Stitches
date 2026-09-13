import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative min-h-140 overflow-hidden bg-[#06151b] sm:min-h-150">
      {/* Hero Image */}
      <img
        src="/images/hero-fashion.jpg"
        alt="O-S Stitches bespoke fashion"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#06151b]/65" />

      {/* Left-side Gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-[#06151b] via-[#06151b]/80 to-transparent" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-140 max-w-7xl items-center px-6 py-20 sm:min-h-150 lg:px-8">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#d7ad55]" />

            <span className="text-[10px] font-medium tracking-[0.22em] text-[#d7ad55] sm:text-xs">
              CUSTOM FASHION
            </span>

            <span className="text-[10px] tracking-[0.15em] text-white/40 sm:text-xs">
              • TIMELESS STYLE
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-xl font-serif text-4xl leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Bespoke Fashion
            <br />
            <span className="text-white/90">Designed Around You</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-lg text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
            From traditional wear to modern styles, we create custom-made
            outfits that fit your personality, style, and occasion.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {/* Primary */}
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#d7ad55] px-6 py-3.5 text-xs font-semibold text-[#06151b] transition hover:bg-[#e5c275]"
            >
              View Our Work
              <ArrowRight size={15} strokeWidth={1.8} />
            </Link>

            {/* Secondary */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/5 px-6 py-3.5 text-xs font-medium text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10"
            >
              <MessageCircle size={15} strokeWidth={1.8} />
              Contact Us
            </a>
          </div>

          {/* Small trust text */}
          <div className="mt-8 flex items-center gap-3 text-[10px] text-white/45">
            <span className="h-px w-6 bg-white/25" />
            <span>Crafted with precision in Nigeria</span>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[#06151b]/40 to-transparent" />
    </section>
  );
}

export default Hero;
