import { ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getSanityPortfolioItems } from "../lib/sanityPortfolio";
import { urlFor } from "../lib/sanityImage";
import { formatPrice } from "../lib/formatPrice";

const categories = [
  "All",
  "Agbada",
  "Traditional Wear",
  "Ceremonial Wear",
  "Custom Design",
];

function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredItems =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        setLoading(true);
        setError("");

        const items = await getSanityPortfolioItems();
        setPortfolioItems(items);
      } catch (error) {
        console.error("SANITY ERROR:", error);
        setError("Unable to load portfolio projects.");
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, []);

  return (
    <>
      {/* =====================================================
          PAGE HERO
      ====================================================== */}
      <section className="bg-[#06151b]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#d7ad55]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d7ad55]">
                Our Work
              </span>
            </div>

            <h1 className="font-serif text-4xl leading-tight tracking-[-0.02em] text-white sm:text-5xl md:text-6xl">
              A collection of
              <br />
              <span className="text-white/60">
                work crafted with intention.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
              Explore selected pieces and custom creations that showcase our
              approach to craftsmanship, detail, and timeless style.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          PORTFOLIO CONTENT
      ====================================================== */}
      <section className="bg-[#f8f6f0] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Category filters */}
          <div className="mb-10 flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition ${
                    isActive
                      ? "border-[#06151b] bg-[#06151b] text-white"
                      : "border-[#06151b]/15 bg-white text-[#06151b]/60 hover:border-[#d7ad55] hover:text-[#06151b]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#06151b]/40">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "Project" : "Projects"}
            </p>

            <p className="text-[9px] uppercase tracking-[0.12em] text-[#06151b]/30">
              O-S Stitches
            </p>
          </div>

          {/* Portfolio grid */}
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden bg-white"
                >
                  <div className="aspect-4/5 bg-[#e9e5db]" />

                  <div className="space-y-3 px-5 py-5">
                    <div className="h-2 w-20 bg-[#06151b]/10" />
                    <div className="h-6 w-40 bg-[#06151b]/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border border-red-200 bg-white px-6 py-20 text-center">
              <p className="font-serif text-2xl text-[#06151b]">
                Unable to load projects
              </p>

              <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-[#06151b]/45">
                {error}
              </p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="group block w-full text-left"
                >
                  <div className="relative aspect-4/5 overflow-hidden bg-[#e9e5db]">
                    <img
                      src={urlFor(item.image).width(1200).quality(85).url()}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-[#06151b]/80 via-[#06151b]/10 to-transparent opacity-80" />

                    <div className="absolute bottom-5 left-5 right-5 flex translate-y-2 items-center justify-between opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white">
                        View Project
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-white">
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 bg-white px-5 py-5">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#b58a32]">
                        {item.category}
                      </p>

                      <h2 className="mt-2 font-serif text-xl text-[#06151b]">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm font-semibold text-[#06151b]">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="border border-[#06151b]/10 bg-white px-6 py-20 text-center">
              <p className="font-serif text-2xl text-[#06151b]">
                No projects found
              </p>

              <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-[#06151b]/45">
                There are currently no portfolio projects in this category.
              </p>

              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className="mt-6 border border-[#06151b]/20 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#06151b] transition hover:border-[#d7ad55] hover:bg-[#d7ad55]"
              >
                View All Projects
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          PROJECT PREVIEW MODAL
      ====================================================== */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#06151b]/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#06151b]/80 text-white transition hover:bg-[#06151b]"
              aria-label="Close project"
            >
              <X size={17} strokeWidth={1.8} />
            </button>

            <div className="grid max-h-[90vh] overflow-y-auto lg:grid-cols-2">
              {/* Image */}
              <div className="relative bg-[#e9e5db]">
                <img
                  src={urlFor(selectedItem.image).width(1200).quality(85).url()}
                  alt={selectedItem.title}
                  className="h-full min-h-100 w-full object-cover"
                />

                <div className="absolute left-4 top-4 rounded-sm bg-[#06151b]/80 px-2.5 py-1.5 backdrop-blur-sm">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#d7ad55]">
                    O-S Stitches
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center px-7 py-10 sm:px-10 lg:px-12">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b58a32]">
                  {selectedItem.category}
                </p>

                <h2 className="mt-3 font-serif text-3xl leading-tight text-[#06151b] sm:text-4xl">
                  {selectedItem.title}
                </h2>

                <div className="my-7 h-px w-full bg-[#06151b]/10" />

                <p className="text-sm leading-6 text-[#06151b]/55">
                  {selectedItem.description ||
                    "A carefully crafted piece from the O-S Stitches collection."}
                </p>

                <div className="mt-8">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-[#06151b]/35">
                    Project status
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Portfolio;
