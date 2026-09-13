import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    title: "Craftsmanship",
    text: "Every piece is approached with attention to detail, precision, and respect for the craft.",
  },
  {
    title: "Individuality",
    text: "Your clothing should reflect your personality, occasion, and sense of style.",
  },
  {
    title: "Quality",
    text: "We focus on thoughtful construction, refined finishing, and materials selected for the design.",
  },
  {
    title: "Timeless Style",
    text: "Our approach balances traditional character with contemporary elegance.",
  },
];

const process = [
  "Understanding your vision",
  "Selecting fabrics and design details",
  "Taking accurate measurements",
  "Crafting and refining the garment",
  "Final fitting and finishing",
];

function About() {
  return (
    <div className="bg-[#f8f6f0] text-[#06151b]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#06151b] text-white">
        <div className="mx-auto grid min-h-[430px] max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d7ad55]">
              About O-S Stitches
            </p>

            <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Fashion shaped around your identity.
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              O-S STITCHES is a custom fashion brand focused on creating
              distinctive pieces that combine craftsmanship, personal style, and
              timeless elegance.
            </p>
          </div>

          <div className="relative hidden h-[330px] overflow-hidden lg:block">
            <img
              src="https://www.demilamarie.com/cdn/shop/files/43BD8341-63B7-40DE-AC00-DF94C20981A6.jpg?v=1744653740&width=1445"
              alt="Fashion design placeholder"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#06151b]/30 via-transparent to-[#06151b]/10" />

            <div className="absolute bottom-5 left-5 border border-white/20 bg-[#06151b]/75 px-4 py-3 backdrop-blur-sm">
              <p className="text-[8px] uppercase tracking-[0.2em] text-[#d7ad55]">
                Preview image
              </p>
              <p className="mt-1 text-[10px] text-white/70">
                Temporary website imagery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b58a32]">
              Our approach
            </p>

            <h2 className="mt-4 max-w-md font-serif text-3xl leading-tight sm:text-4xl">
              More than clothing. A personal expression.
            </h2>
          </div>

          <div className="max-w-2xl text-sm leading-7 text-slate-600">
            <p>
              At O-S STITCHES, the process begins with understanding the person
              behind the garment. From the occasion and preferred silhouette to
              fabric, colour, and finishing details, every decision contributes
              to the final look.
            </p>

            <p className="mt-5">
              Our custom approach allows each garment to be developed with the
              individual client in mind rather than simply selecting something
              off the rack.
            </p>

            <p className="mt-5">
              Whether the occasion calls for traditional elegance, ceremonial
              presence, or a contemporary custom design, the objective remains
              the same: create something that feels distinctly yours.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b58a32]">
              What we value
            </p>

            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              The principles behind every piece.
            </h2>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-7">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7ad55]/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d7ad55]" />
                </div>

                <h3 className="mt-6 font-serif text-xl">{value.title}</h3>

                <p className="mt-3 text-xs leading-6 text-slate-500">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#f8f6f0]">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-24">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b58a32]">
              The process
            </p>

            <h2 className="mt-4 max-w-lg font-serif text-3xl leading-tight sm:text-4xl">
              From your idea to a finished piece.
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-slate-600">
              A custom garment is a collaborative process. We work through the
              important details with you so the final result reflects the
              original vision as closely as possible.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#06151b] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#10262e]"
            >
              Start a conversation
              <ArrowRight size={14} strokeWidth={1.8} />
            </Link>
          </div>

          <div className="border border-slate-200 bg-white">
            {process.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-5 border-b border-slate-200 px-6 py-5 last:border-b-0"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d7ad55] font-serif text-sm text-[#b58a32]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-3">
                  <Check
                    size={14}
                    strokeWidth={1.8}
                    className="text-[#b58a32]"
                  />

                  <span className="text-sm text-slate-700">{step}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Temporary content notice */}
      <section className="border-t border-[#d7ad55]/20 bg-[#06151b]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#d7ad55]">
              Content placeholder
            </p>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-white/55">
              This page currently uses temporary brand copy while the designer
              provides the official O-S STITCHES story, background, and brand
              details.
            </p>
          </div>

          <Link
            to="/portfolio"
            className="inline-flex shrink-0 items-center justify-center gap-2 border border-[#d7ad55]/60 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#d7ad55] transition hover:bg-[#d7ad55] hover:text-[#06151b]"
          >
            View our work
            <ArrowRight size={14} strokeWidth={1.8} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
