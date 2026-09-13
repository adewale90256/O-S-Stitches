import { ArrowUpRight, MessageCircle } from "lucide-react";

function HomeCTA() {
  return (
    <section className="relative overflow-hidden bg-[#06151b]">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#d7ad55]/10" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full border border-[#d7ad55]/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col items-start justify-between gap-10 rounded-lg border border-white/10 bg-white/[0.025] px-7 py-10 sm:px-10 lg:flex-row lg:items-center lg:px-14 lg:py-12">
          {/* Text */}
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#d7ad55]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d7ad55]">
                Let's Create
              </span>
            </div>

            <h2 className="font-serif text-3xl leading-tight tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl">
              Your style deserves
              <br />
              <span className="text-white/70">something exceptional.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-6 text-white/50 sm:text-base sm:leading-7">
              Whether you have a specific design in mind or need help bringing
              your idea to life, we're here to create something made
              specifically for you.
            </p>
          </div>

          {/* CTA */}
          <div className="shrink-0">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 rounded-md bg-[#d7ad55] px-6 py-4 text-xs font-semibold text-[#06151b] transition hover:bg-[#e5c275]"
            >
              <MessageCircle size={16} strokeWidth={1.8} />
              Start a Conversation
              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <p className="mt-3 text-center text-[10px] text-white/30">
              Available via WhatsApp
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeCTA;
