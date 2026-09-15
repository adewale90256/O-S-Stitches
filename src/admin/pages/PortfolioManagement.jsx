import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Star,
  X,
  Image as ImageIcon,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getPortfolioItems, deletePortfolioItem } from "../../lib/portfolio";

const categories = [
  "All",
  "Agbada",
  "Traditional Wear",
  "Ceremonial Wear",
  "Custom Design",
];

function PortfolioManagement() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ==========================================================
  // LOAD PORTFOLIO FROM FIRESTORE
  // ==========================================================

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setError("");

      const items = await getPortfolioItems();

      setPortfolioItems(items);
    } catch (err) {
      console.error("Failed to load portfolio:", err);

      setError(
        "Unable to load portfolio items. Please check your Firebase connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  // ==========================================================
  // FILTERING
  // ==========================================================

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return portfolioItems.filter((item) => {
      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query);

      const matchesCategory = category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [portfolioItems, search, category]);

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      setDeleting(true);
      setError("");

      await deletePortfolioItem(deleteItem.id);

      setPortfolioItems((current) =>
        current.filter((item) => item.id !== deleteItem.id),
      );

      setDeleteItem(null);
    } catch (err) {
      console.error("Failed to delete portfolio item:", err);

      setError("Unable to delete this portfolio item. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  const hasFilters = search !== "" || category !== "All";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b58a32]">
            Content Management
          </p>

          <h2 className="text-xl font-semibold tracking-tight text-[#06151b] sm:text-2xl">
            Portfolio
          </h2>

          <p className="mt-1 text-[11px] text-slate-500">
            Manage the designer's completed work displayed on the website.
          </p>
        </div>

        <Link
          to="/admin/portfolio/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#06151b] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#10252d]"
        >
          <Plus size={14} strokeWidth={2} />
          Add New Work
        </Link>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />

          <div>
            <p className="text-[10px] font-semibold text-red-700">
              Something went wrong
            </p>

            <p className="mt-1 text-[9px] leading-5 text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* SEARCH + FILTERS */}

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={15}
            strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search portfolio items..."
            className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-9 text-[10px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#d7ad55] focus:ring-1 focus:ring-[#d7ad55]/20"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-3 py-1.5 text-[9px] font-medium transition ${
                  active
                    ? "border-[#06151b] bg-[#06151b] text-white"
                    : "border-slate-200 bg-white text-slate-500 hover:border-[#d7ad55] hover:text-[#06151b]"
                }`}
              >
                {item}
              </button>
            );
          })}

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-[9px] font-medium text-slate-400 underline underline-offset-2 hover:text-[#06151b]"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* RESULT INFO */}

      {!loading && (
        <div className="my-4 flex items-center justify-between">
          <p className="text-[9px] text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {filteredItems.length}
            </span>{" "}
            {filteredItems.length === 1 ? "item" : "items"}
          </p>

          {category !== "All" && (
            <p className="text-[9px] text-slate-400">
              Category:{" "}
              <span className="font-medium text-slate-600">{category}</span>
            </p>
          )}
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div className="flex min-h-75 items-center justify-center rounded-lg border border-slate-200 bg-white">
          <div className="flex flex-col items-center">
            <LoaderCircle size={25} className="animate-spin text-[#d7ad55]" />

            <p className="mt-3 text-[10px] text-slate-400">
              Loading portfolio...
            </p>
          </div>
        </div>
      ) : filteredItems.length > 0 ? (
        /* PORTFOLIO GRID */

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* IMAGE */}

              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <ImageIcon size={30} />
                  </div>
                )}

                {item.featured && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#d7ad55] px-2 py-1 text-[7px] font-semibold text-[#06151b]">
                    <Star size={9} fill="currentColor" />
                    Featured
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="absolute inset-0 flex items-center justify-center bg-[#06151b]/0 opacity-0 transition group-hover:bg-[#06151b]/45 group-hover:opacity-100"
                >
                  <span className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[9px] font-semibold text-[#06151b]">
                    <Eye size={13} />
                    Preview
                  </span>
                </button>
              </div>

              {/* CARD CONTENT */}

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-xs font-semibold text-[#06151b]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[9px] text-[#b58a32]">
                      {item.category}
                    </p>
                  </div>

                  <p className="shrink-0 text-[10px] font-semibold text-slate-700">
                    {item.price || "On Request"}
                  </p>
                </div>

                <p className="mt-3 line-clamp-2 text-[9px] leading-5 text-slate-500">
                  {item.description}
                </p>

                {/* ACTIONS */}

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500 hover:text-[#06151b]"
                  >
                    <Eye size={13} />
                    View
                  </button>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/portfolio/${item.id}/edit`}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-[#06151b]"
                      aria-label={`Edit ${item.title}`}
                    >
                      <Pencil size={13} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteItem(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* EMPTY STATE */

        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <ImageIcon size={18} strokeWidth={1.7} />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-[#06151b]">
            No portfolio items found
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-[10px] leading-5 text-slate-400">
            {hasFilters
              ? "No work matches your current search or category filter."
              : "Your portfolio is currently empty. Add your first completed work."}
          </p>

          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-md bg-[#06151b] px-4 py-2 text-[9px] font-semibold text-white"
            >
              Clear filters
            </button>
          ) : (
            <Link
              to="/admin/portfolio/new"
              className="mt-4 inline-flex rounded-md bg-[#06151b] px-4 py-2 text-[9px] font-semibold text-white"
            >
              Add New Work
            </Link>
          )}
        </div>
      )}

      {/* DEVELOPMENT NOTE */}

      <div className="mt-6 rounded-lg border border-dashed border-[#d7ad55]/50 bg-[#d7ad55]/5 px-4 py-3">
        <p className="text-[9px] leading-relaxed text-slate-500">
          <span className="font-semibold text-[#8c6825]">Firebase:</span>{" "}
          Portfolio records are now loaded from Firestore. Image uploads will be
          connected to Firebase Storage next.
        </p>
      </div>

      {/* PREVIEW MODAL */}

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
              aria-label="Close preview"
            >
              <X size={15} />
            </button>

            <div className="max-h-[50vh] overflow-hidden bg-slate-100">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="h-full max-h-[50vh] w-full object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center text-slate-300">
                  <ImageIcon size={40} />
                </div>
              )}
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#b58a32]">
                    {selectedItem.category}
                  </span>

                  <h3 className="mt-1 text-lg font-semibold text-[#06151b]">
                    {selectedItem.title}
                  </h3>
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  {selectedItem.price || "On Request"}
                </span>
              </div>

              <p className="mt-4 text-[10px] leading-6 text-slate-500">
                {selectedItem.description}
              </p>

              {selectedItem.featured && (
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#d7ad55]/15 px-3 py-1.5 text-[8px] font-semibold text-[#8c6825]">
                  <Star size={10} fill="currentColor" />
                  Featured portfolio item
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}

      {deleteItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={17} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#06151b]">
              Delete portfolio item?
            </h3>

            <p className="mt-2 text-[10px] leading-5 text-slate-500">
              You are about to delete{" "}
              <span className="font-semibold text-slate-700">
                {deleteItem.title}
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteItem(null)}
                className="rounded-md border border-slate-200 px-4 py-2 text-[9px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-[9px] font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && (
                  <LoaderCircle size={12} className="animate-spin" />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioManagement;
