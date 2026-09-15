import { useEffect, useState } from "react";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getCatalogueItems } from "../lib/catalogue";

// ============================================================
// DEMO / PLACEHOLDER DATA
// ------------------------------------------------------------
// This is temporary catalogue content for UI development only.
// The designer's real catalogue will eventually come from
// Firebase and should NOT be hard-coded here.
// ============================================================

// const demoCatalogueItems = [
//   {
//     id: "demo-catalogue-1",
//     name: "Royal Blue Agbada",
//     category: "Agbada",
//     description:
//       "A refined traditional ensemble with a clean, elegant silhouette.",
//     image:
//       "https://www.demilamarie.com/cdn/shop/files/43BD8341-63B7-40DE-AC00-DF94C20981A6.jpg?v=1744653740&width=1445",
//     slug: "royal-blue-agbada",
//   },
//   {
//     id: "demo-catalogue-2",
//     name: "Classic White Agbada",
//     category: "Agbada",
//     description:
//       "A timeless white traditional look designed for special occasions.",
//     image:
//       "https://i.etsystatic.com/25411016/r/il/48f9e3/5290963360/il_1588xN.5290963360_b161.jpg",
//     slug: "classic-white-agbada",
//   },
//   {
//     id: "demo-catalogue-3",
//     name: "Midnight Blue Ensemble",
//     category: "Traditional Wear",
//     description:
//       "A sophisticated contemporary interpretation of traditional Nigerian fashion.",
//     image:
//       "https://i.etsystatic.com/25330852/r/il/515519/6302081499/il_fullxfull.6302081499_lzek.jpg",
//     slug: "midnight-blue-ensemble",
//   },
//   {
//     id: "demo-catalogue-4",
//     name: "Ceremonial Classic",
//     category: "Ceremonial Wear",
//     description: "Statement ceremonial wear created for important moments.",
//     image:
//       "https://www.demilamarie.com/cdn/shop/files/43BD8341-63B7-40DE-AC00-DF94C20981A6.jpg?v=1744653740&width=1445",
//     slug: "ceremonial-classic",
//   },
//   {
//     id: "demo-catalogue-5",
//     name: "Heritage Collection",
//     category: "Traditional Wear",
//     description:
//       "A classic silhouette inspired by heritage and modern tailoring.",
//     image:
//       "https://i.etsystatic.com/25411016/r/il/48f9e3/5290963360/il_1588xN.5290963360_b161.jpg",
//     slug: "heritage-collection",
//   },
//   {
//     id: "demo-catalogue-6",
//     name: "Contemporary Classic",
//     category: "Custom Design",
//     description:
//       "A modern custom design balancing structure, comfort, and personality.",
//     image:
//       "https://i.etsystatic.com/25330852/r/il/515519/6302081499/il_fullxfull.6302081499_lzek.jpg",
//     slug: "contemporary-classic",
//   },
// ];

function Catalogue() {
  const [catalogueItems, setCatalogueItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCatalogue() {
      try {
        setLoading(true);
        setError("");

        const items = await getCatalogueItems();
        setCatalogueItems(items);
      } catch (err) {
        console.error("Failed to load catalogue:", err);
        setError("Unable to load catalogue items.");
      } finally {
        setLoading(false);
      }
    }

    loadCatalogue();
  }, []);

  const catalogueCategories = [
    "All",
    ...new Set(catalogueItems.map((item) => item.category).filter(Boolean)),
  ];
  const filteredItems = catalogueItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      !searchTerm ||
      item.title.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      (item.description || "").toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setActiveCategory("All");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      {/* ======================================================
          HERO
      ====================================================== */}
      <section className="bg-[#06151b]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#d7ad55]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d7ad55]">
                Our Catalogue
              </span>
            </div>

            <h1 className="font-serif text-4xl leading-tight tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
              Pieces made to
              <br />
              <span className="text-white/65">make an impression.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
              Explore our collection of traditional, contemporary, and custom
              fashion pieces. Each design can be tailored to your preferred
              style, fabric, and fit.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          CATALOGUE CONTENT
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* Search + mobile filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={16}
              strokeWidth={1.7}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#06151b]/40"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalogue..."
              className="h-11 w-full rounded-md border border-[#06151b]/12 bg-white pl-10 pr-4 text-xs text-[#06151b] outline-none transition placeholder:text-[#06151b]/35 focus:border-[#d7ad55]"
            />
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#06151b]/15 bg-white px-4 text-xs font-medium text-[#06151b] md:hidden"
          >
            <SlidersHorizontal size={15} strokeWidth={1.7} />
            Filters
          </button>
        </div>

        {/* ====================================================
            CATEGORY FILTERS
        ==================================================== */}
        <div className={`mt-6 ${filtersOpen ? "block" : "hidden"} md:block`}>
          <div className="flex flex-wrap items-center gap-2 border-b border-[#06151b]/10 pb-6">
            {catalogueCategories.map((category) => {
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-[10px] font-medium transition ${
                    active
                      ? "border-[#06151b] bg-[#06151b] text-white"
                      : "border-[#06151b]/12 bg-white text-[#06151b]/60 hover:border-[#06151b]/30 hover:text-[#06151b]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* ====================================================
            RESULTS HEADER
        ==================================================== */}
        <div className="flex items-center justify-between py-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#06151b]/40">
              Catalogue
            </p>

            <h2 className="mt-1 font-serif text-2xl text-[#06151b]">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "Piece" : "Pieces"}
            </h2>
          </div>

          {(search || activeCategory !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#06151b]/50 transition hover:text-[#06151b]"
            >
              <X size={13} />
              Clear filters
            </button>
          )}
        </div>

        {/* ====================================================
            PRODUCT GRID
        ==================================================== */}
        {loading ? (
          <div className="flex min-h-75 items-center justify-center">
            <p className="text-xs text-[#06151b]/45">Loading catalogue...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-75 items-center justify-center border border-dashed border-[#06151b]/15 bg-white px-6 text-center">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <article key={item.id} className="group">
                <Link to={`/catalogue/${item.slug}`} className="block">
                  <div className="relative aspect-4/5 overflow-hidden bg-[#e9e5db]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[#06151b]/90 p-4 transition-transform duration-300 group-hover:translate-y-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.14em] text-[#d7ad55]">
                          View piece
                        </span>

                        <ArrowRight
                          size={14}
                          strokeWidth={1.7}
                          className="text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.14em] text-[#b58a32]">
                          {item.category}
                        </p>

                        <h3 className="mt-1 font-serif text-xl text-[#06151b]">
                          {item.title}
                        </h3>
                      </div>

                      <span className="mt-1 text-[10px] text-[#06151b]/35">
                        Custom
                      </span>
                    </div>

                    <p className="mt-2 max-w-sm text-xs leading-5 text-[#06151b]/50">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* ==================================================
             EMPTY STATE
          ================================================== */
          <div className="flex min-h-75 flex-col items-center justify-center border border-dashed border-[#06151b]/15 bg-white px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d7ad55]/40">
              <Search size={18} strokeWidth={1.5} className="text-[#b58a32]" />
            </div>

            <h3 className="mt-5 font-serif text-2xl text-[#06151b]">
              No pieces found
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-5 text-[#06151b]/45">
              Try another search term or select a different category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-md bg-[#06151b] px-5 py-3 text-[10px] font-semibold uppercase tracking text-white transition hover:bg-[#0d252d]"
            >
              Reset catalogue
            </button>
          </div>
        )}

        {/* ====================================================
            BOTTOM NOTE
        ==================================================== */}
        <div className="mt-16 border-t border-[#06151b]/10 pt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[10px] leading-5 text-[#06151b]/40">
              Every catalogue piece can be discussed and customized based on
              fabric, colour, measurements, and occasion.
            </p>

            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#06151b] transition hover:text-[#b58a32]"
            >
              Discuss a custom piece
              <ArrowRight size={13} strokeWidth={1.7} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Catalogue;
