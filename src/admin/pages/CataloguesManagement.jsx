import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  PackageOpen,
  LoaderCircle,
} from "lucide-react";

import { getCatalogueItems, deleteCatalogueItem } from "../../lib/catalogue";

function CataloguesManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    if (!notification.message) return;

    const timer = setTimeout(() => {
      setNotification({
        type: "",
        message: "",
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification]);

  async function loadCatalogue() {
    try {
      setLoading(true);
      setError("");

      const data = await getCatalogueItems();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load catalogue items.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalogue();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this catalogue item?",
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      await deleteCatalogueItem(id);

      setItems((currentItems) => currentItems.filter((item) => item.id !== id));

      setNotification({
        type: "success",
        message: "Catalogue item deleted successfully.",
      });
    } catch (error) {
      console.error("Delete catalogue error:", error);

      setNotification({
        type: "error",
        message: error.message || "Unable to delete catalogue item.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8 p-8">
      {notification.message && (
        <div
          className={`mb-6 flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span>{notification.message}</span>

          <button
            type="button"
            onClick={() =>
              setNotification({
                type: "",
                message: "",
              })
            }
            className="ml-4 text-xs font-semibold uppercase tracking-wide opacity-70 transition hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d7ad55]">
            Catalogue
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-[#071a3d]">
            Catalogue Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the designs displayed in your public catalogue.
          </p>
        </div>

        <Link
          to="/admin/catalogue/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#071a3d] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#0d2858]"
        >
          <Plus size={17} />
          Add Catalogue Item
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="aspect-4/5 bg-gray-200" />

              <div className="space-y-3 p-5">
                <div className="h-4 w-2/3 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
                <div className="h-8 w-full rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f2e8] text-[#d7ad55]">
            <PackageOpen size={26} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-[#071a3d]">
            No catalogue items yet
          </h2>

          <p className="mt-2 max-w-md text-sm text-gray-500">
            Add your first catalogue design to start building your collection.
          </p>

          <Link
            to="/admin/catalogue/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#d7ad55] px-4 py-2.5 text-sm font-semibold text-[#071a3d] transition hover:opacity-90"
          >
            <Plus size={16} />
            Add Catalogue Item
          </Link>
        </div>
      ) : (
        /* Catalogue Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Image */}
              <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No image
                  </div>
                )}

                {/* Featured */}
                {item.featured && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#d7ad55] px-2 py-1 text-[7px] font-semibold text-[#06151b]">
                    <Star size={9} fill="currentColor" />
                    Featured
                  </span>
                )}

                {/* Availability */}
                <span
                  className={`absolute left-3 top-3 rounded-full px-2 py-1 text-[8px] font-semibold ${
                    item.available
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>

              {/* Details */}
              <div className="p-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#d7ad55]">
                  {item.category}
                </p>

                <h2 className="mt-1 text-base font-semibold text-[#071a3d]">
                  {item.title}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {item.description || "No description added."}
                </p>

                {/* Price */}
                <div className="mt-4">
                  {item.priceType === "on-request" ? (
                    <span className="text-sm font-medium text-[#071a3d]">
                      Price on request
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-[#071a3d]">
                      ₦{Number(item.price || 0).toLocaleString()}
                      {item.priceType === "starting" && (
                        <span className="ml-1 text-xs font-normal text-gray-500">
                          starting
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                  <Link
                    to={`/admin/catalogue/${item.id}/edit`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-[#071a3d] transition hover:bg-gray-50"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId !== null}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition ${
                      deletingId === item.id
                        ? "cursor-not-allowed bg-red-100 text-red-400"
                        : deletingId !== null
                          ? "cursor-not-allowed text-red-300"
                          : "text-red-600 hover:bg-red-50"
                    }`}
                  >
                    {deletingId === item.id ? (
                      <>
                        <LoaderCircle size={14} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CataloguesManagement;
