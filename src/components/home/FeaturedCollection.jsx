import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getCatalogueItems } from "../../lib/catalogue";
import brand from "../../config/brand";

function FeaturedCollection() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedItems() {
      try {
        const items = await getCatalogueItems();

        const featured = items
          .filter((item) => item.featured && item.available)
          .slice(0, 3);

        setFeaturedItems(featured);
      } catch (error) {
        console.error("Failed to load featured catalogue items:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedItems();
  }, []);
  return (
    <section
      className="py-20 sm:py-24"
      style={{ backgroundColor: brand.colors.background }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span
                className="h-px w-8"
                style={{ backgroundColor: brand.colors.accent }}
              />

              <span
                className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: brand.colors.accent }}
              >
                Our Collection
              </span>
            </div>

            <h2
              className="max-w-xl font-serif text-3xl leading-tight tracking-[-0.02em] sm:text-4xl md:text-5xl"
              style={{ color: brand.colors.primary }}
            >
              Pieces made to
              <span style={{ color: brand.colors.accent }}>
                {" "}
                make an impression.
              </span>
            </h2>

            <p
              className="mt-4 max-w-lg text-sm leading-6 opacity-55"
              style={{ color: brand.colors.primary }}
            >
              Explore a selection of carefully crafted pieces, designed with
              character, precision, and timeless style.
            </p>
          </div>

          <Link
            to="/catalogue"
            className="group inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] transition"
            style={{ color: brand.colors.primary }}
          >
            View Catalogue
            <ArrowRight
              size={15}
              strokeWidth={1.7}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Collection */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-xs uppercase tracking-[0.12em] text-[#06151b]/40">
                Loading collection...
              </p>
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-xs uppercase tracking-[0.12em] text-[#06151b]/40">
                Featured pieces coming soon.
              </p>
            </div>
          ) : (
            featuredItems.map((item) => (
              <Link
                key={item.id}
                to={`/catalogue/${item.slug}`}
                className="group overflow-hidden bg-white"
              >
                <div className="relative aspect-4/5 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div
                    className="absolute inset-0 opacity-70"
                    style={{
                      background: `linear-gradient(to top, ${brand.colors.primary}b3, transparent)`,
                    }}
                  />

                  <div className="absolute bottom-5 left-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition duration-300 group-hover:opacity-100">
                    View Details
                    <ArrowRight size={13} />
                  </div>
                </div>

                <div className="px-5 py-5">
                  <p
                    className="text-[9px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: brand.colors.accent }}
                  >
                    {item.category}
                  </p>
                  <h3
                    className="mt-2 font-serif text-xl"
                    style={{ color: brand.colors.primary }}
                  >
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Catalogue button */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 border px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition"
            style={{
              borderColor: `${brand.colors.primary}33`,
              color: brand.colors.primary,
            }}
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
