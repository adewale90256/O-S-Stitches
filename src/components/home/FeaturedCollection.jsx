import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/*
 * ============================================================
 * DEMO / PLACEHOLDER DATA
 * ============================================================
 * These items are temporary and are NOT the designer's real
 * catalogue products.
 *
 * Replace this data with the designer's actual catalogue data
 * when it becomes available.
 *
 * Eventually this component will receive catalogue data from
 * Firebase instead of using hard-coded items.
 * ============================================================
 */
const demoFeaturedItems = [
  {
    id: "demo-1",
    name: "Royal Blue Agbada",
    category: "Traditional Wear",
    image:
      "https://www.demilamarie.com/cdn/shop/files/43BD8341-63B7-40DE-AC00-DF94C20981A6.jpg?v=1744653740&width=1445",
    slug: "demo-royal-blue-agbada",
  },
  {
    id: "demo-2",
    name: "Classic White Agbada",
    category: "Ceremonial Wear",
    image:
      "https://i.etsystatic.com/25411016/r/il/48f9e3/5290963360/il_1588xN.5290963360_b161.jpg",
    slug: "demo-classic-white-agbada",
  },
  {
    id: "demo-3",
    name: "Signature Blue Collection",
    category: "Custom Design",
    image:
      "https://i.etsystatic.com/25330852/r/il/515519/6302081499/il_fullxfull.6302081499_lzek.jpg",
    slug: "demo-signature-blue-collection",
  },
];

function FeaturedCollection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#d7ad55]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b58a32]">
                Our Collection
              </span>
            </div>

            <h2 className="max-w-xl font-serif text-3xl leading-tight tracking-[-0.02em] text-[#06151b] sm:text-4xl md:text-5xl">
              Pieces made to
              <span className="text-[#b58a32]"> make an impression.</span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-[#06151b]/55">
              Explore a selection of carefully crafted pieces, designed with
              character, precision, and timeless style.
            </p>
          </div>

          <Link
            to="/catalogue"
            className="group inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#06151b] transition hover:text-[#b58a32]"
          >
            View Catalogue
            <ArrowRight
              size={15}
              strokeWidth={1.7}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Demo notice */}
        <div className="mt-8 border border-[#d7ad55]/30 bg-[#f8f6f0] px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[#06151b]/50">
            <span className="font-semibold text-[#b58a32]">
              Preview content:
            </span>{" "}
            These images and items are temporary placeholders and will be
            replaced with O-S STITCHES' actual collection.
          </p>
        </div>

        {/* Collection */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {demoFeaturedItems.map((item) => (
            <Link
              key={item.id}
              to={`/catalogue/${item.slug}`}
              className="group overflow-hidden bg-[#f5f2eb]"
            >
              <div className="relative aspect-4/5 overflow-hidden">
                <img
                  src={item.image}
                  alt={`Demo placeholder - ${item.name}`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Demo badge */}
                <div className="absolute left-4 top-4 rounded-sm bg-[#06151b]/80 px-2.5 py-1.5 backdrop-blur-sm">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#d7ad55]">
                    Demo
                  </span>
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-[#06151b]/70 via-transparent to-transparent opacity-70" />

                <div className="absolute bottom-5 left-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition duration-300 group-hover:opacity-100">
                  View Details
                  <ArrowRight size={13} />
                </div>
              </div>

              <div className="px-5 py-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b58a32]">
                  {item.category}
                </p>

                <h3 className="mt-2 font-serif text-xl text-[#06151b]">
                  {item.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Catalogue button */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 border border-[#06151b]/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#06151b] transition hover:border-[#d7ad55] hover:bg-[#d7ad55] hover:text-[#06151b]"
          >
            Explore All Pieces
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollection;
