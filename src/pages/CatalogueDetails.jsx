import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCatalogueItemBySlug } from "../lib/catalogue";

// ============================================================
// DEMO / PLACEHOLDER DATA
// ------------------------------------------------------------
// Temporary catalogue data for UI development.
// This will eventually be replaced by Firebase data.
// ============================================================

function CatalogueDetails() {
  const { slug } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [imageVisible, setImageVisible] = useState(true);

  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        setError("");

        const catalogueItem = await getCatalogueItemBySlug(slug);

        setItem(catalogueItem);
        setSelectedImage(catalogueItem.image);
      } catch (err) {
        console.error("Failed to load catalogue item:", err);
        setError("Unable to load catalogue item.");
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [slug]);

  // ==========================================================
  // ITEM NOT FOUND
  // ==========================================================

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#f8f6f0] px-6 py-20">
        <p className="text-xs text-[#06151b]/45">Loading catalogue...</p>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="min-h-[70vh] bg-[#f8f6f0] px-6 py-20">
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b58a32]">
            Catalogue
          </span>

          <h1 className="mt-4 font-serif text-4xl text-[#06151b]">
            Piece not found
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#06151b]/50">
            {error ||
              "The catalogue piece you're looking for doesn't exist or may have been removed."}
          </p>

          <Link
            to="/catalogue"
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#06151b] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#0d252d]"
          >
            <ArrowLeft size={14} />
            Back to Catalogue
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      {/* ======================================================
          BREADCRUMB
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-6 pt-7 lg:px-8">
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#06151b]/45 transition hover:text-[#06151b]"
        >
          <ArrowLeft size={13} strokeWidth={1.7} />
          Back to Catalogue
        </Link>
      </div>

      {/* ======================================================
          PRODUCT DETAILS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* IMAGE */}
          <div>
            <div className="relative aspect-4/5 overflow-hidden bg-[#e9e5db]">
              <img
                src={selectedImage || item.image}
                alt={item.title}
                className={`h-full w-full object-cover transition-opacity duration-500 ${
                  imageVisible ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>

            {(item.gallery?.length > 0 || item.image) && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
                {[item.image, ...(item.gallery || [])].map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => {
                      setImageVisible(false);

                      setTimeout(() => {
                        setSelectedImage(image);
                        setImageVisible(true);
                      }, 150);
                    }}
                    className={`group relative aspect-square w-24 shrink-0 overflow-hidden border bg-[#e9e5db] transition-all duration-300 sm:w-auto ${
                      selectedImage === image
                        ? "border-[#d7ad55] shadow-sm"
                        : "border-transparent hover:border-[#06151b]/20"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className={`h-full w-full object-cover transition duration-500 ${
                        selectedImage === image
                          ? "scale-[1.02]"
                          : "group-hover:scale-105"
                      }`}
                    />

                    {selectedImage === image && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#d7ad55]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMATION */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#d7ad55]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b58a32]">
                {item.category}
              </span>
            </div>

            <h1 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.02em] text-[#06151b] sm:text-5xl">
              {item.title}
            </h1>

            <p className="mt-6 text-sm leading-7 text-[#06151b]/55">
              {item.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {item.priceType === "on-request" ? (
                <span className="text-sm font-semibold text-[#06151b]">
                  Price on request
                </span>
              ) : item.priceType === "starting" ? (
                <span className="text-sm font-semibold text-[#06151b]">
                  From ₦{Number(item.price || 0).toLocaleString()}
                </span>
              ) : (
                <span className="text-sm font-semibold text-[#06151b]">
                  ₦{Number(item.price || 0).toLocaleString()}
                </span>
              )}

              <span
                className={`rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${
                  item.available
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {item.available ? "Available" : "Currently unavailable"}
              </span>
            </div>

            <div className="mt-8 border-y border-[#06151b]/10 py-6">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#06151b]">
                Customization
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  "Fabric and colour selection",
                  "Personal measurements",
                  "Design adjustments",
                  "Made specifically for your occasion",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#06151b]">
                      <Check
                        size={11}
                        strokeWidth={2}
                        className="text-[#d7ad55]"
                      />
                    </span>

                    <span className="text-xs leading-5 text-[#06151b]/60">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs leading-5 text-[#06151b]/45">
                Interested in this piece? Contact O-S Stitches to discuss
                availability, customization, measurements, and pricing.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#06151b] px-6 py-3.5 text-xs font-semibold text-white transition hover:bg-[#0d252d]"
                >
                  <MessageCircle size={15} strokeWidth={1.8} />
                  Enquire on WhatsApp
                </a>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-[#06151b]/15 bg-white px-6 py-3.5 text-xs font-medium text-[#06151b] transition hover:border-[#06151b]/30"
                >
                  Contact Us
                  <ArrowRight size={14} strokeWidth={1.7} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CUSTOM ORDER SECTION
      ====================================================== */}

      <section className="border-t border-[#06151b]/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b58a32]">
                Made for you
              </p>

              <h2 className="mt-3 font-serif text-3xl text-[#06151b] sm:text-4xl">
                Looking for something different?
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#06151b]/50">
                The catalogue is only a starting point. If you have a particular
                fabric, colour, style, or occasion in mind, we can discuss a
                custom design created specifically for you.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#d7ad55] px-6 py-3.5 text-xs font-semibold text-[#06151b] transition hover:bg-[#e5c275]"
            >
              Start a Custom Design
              <ArrowRight size={15} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CatalogueDetails;
