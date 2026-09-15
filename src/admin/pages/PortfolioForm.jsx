import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  Save,
  X,
  Star,
  Trash2,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import {
  createPortfolioItem,
  getPortfolioItems,
  updatePortfolioItem,
} from "../../lib/portfolio";

const categories = [
  "Agbada",
  "Traditional Wear",
  "Ceremonial Wear",
  "Custom Design",
];

function PortfolioForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    category: "Agbada",
    description: "",
    priceType: "fixed",
    price: "",
    featured: false,
    image: "",
  });

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState("");

  // ----------------------------------------------------------
  // LOAD EXISTING PORTFOLIO ITEM FOR EDITING
  // ----------------------------------------------------------

  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }

    async function loadItem() {
      try {
        setLoading(true);
        setError("");

        const items = await getPortfolioItems();

        const existingItem = items.find((item) => item.id === id);

        if (!existingItem) {
          setError("Portfolio item not found.");
          return;
        }

        setForm({
          title: existingItem.title || "",
          category: existingItem.category || "Agbada",
          description: existingItem.description || "",
          priceType: existingItem.priceType || "fixed",
          price: existingItem.price || "",
          featured: existingItem.featured || false,
          image: existingItem.image || "",
        });

        setPreview(existingItem.image || "");
      } catch (err) {
        console.error("Failed to load portfolio item:", err);
        setError("Unable to load this portfolio item.");
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id, isEditing]);

  // ----------------------------------------------------------
  // FORM CHANGE
  // ----------------------------------------------------------

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // ----------------------------------------------------------
  // IMAGE PREVIEW
  // ----------------------------------------------------------

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  }

  function removeImage() {
    setPreview("");

    setForm((current) => ({
      ...current,
      image: "",
    }));
  }

  // ----------------------------------------------------------
  // SAVE TO FIRESTORE
  // ----------------------------------------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const portfolioData = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        priceType: form.priceType,
        price: form.priceType === "on-request" ? "" : form.price,
        featured: form.featured,
      };

      if (isEditing) {
        await updatePortfolioItem(id, portfolioData, imageFile);
      } else {
        await createPortfolioItem(portfolioData, imageFile);
      }

      navigate("/admin/portfolio");
    } catch (err) {
      console.error("Failed to save portfolio item:", err);

      setError(
        isEditing
          ? "Unable to update this portfolio item."
          : "Unable to create this portfolio item.",
      );
    } finally {
      setSaving(false);
    }
  }

  // ----------------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <LoaderCircle size={20} className="animate-spin" />
          Loading portfolio item...
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/admin/portfolio"
              className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-[#b58a32]"
            >
              <ArrowLeft size={15} />
              Back to Portfolio
            </Link>

            <h1 className="text-2xl font-semibold tracking-tight text-[#06151b]">
              {isEditing ? "Edit Portfolio Item" : "Create Portfolio Item"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update the details of this portfolio work."
                : "Add a new work to the portfolio."}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Main form */}
            <div className="space-y-6">
              {/* Work Details */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="text-sm font-semibold text-[#06151b]">
                    Work Details
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Basic information about this portfolio item.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-xs font-semibold text-slate-700"
                    >
                      Title
                    </label>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Royal Blue Agbada"
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#d7ad55] focus:ring-2 focus:ring-[#d7ad55]/20"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-xs font-semibold text-slate-700"
                    >
                      Category
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#d7ad55] focus:ring-2 focus:ring-[#d7ad55]/20"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-xs font-semibold text-slate-700"
                    >
                      Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe the work, design, fabric, occasion, or other relevant details..."
                      rows={6}
                      required
                      className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#d7ad55] focus:ring-2 focus:ring-[#d7ad55]/20"
                    />

                    <p className="mt-2 text-[11px] text-slate-400">
                      Keep the description clear and useful to potential
                      customers.
                    </p>
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="text-sm font-semibold text-[#06151b]">
                    Pricing
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Choose how the price should be displayed.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="priceType"
                      className="mb-2 block text-xs font-semibold text-slate-700"
                    >
                      Price Type
                    </label>

                    <select
                      id="priceType"
                      name="priceType"
                      value={form.priceType}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#d7ad55] focus:ring-2 focus:ring-[#d7ad55]/20"
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="starting">Starting From</option>
                      <option value="on-request">On Request</option>
                    </select>
                  </div>

                  {form.priceType !== "on-request" && (
                    <div>
                      <label
                        htmlFor="price"
                        className="mb-2 block text-xs font-semibold text-slate-700"
                      >
                        Price (₦)
                      </label>

                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="250000"
                        required
                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#d7ad55] focus:ring-2 focus:ring-[#d7ad55]/20"
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* Images */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="text-sm font-semibold text-[#06151b]">
                    Images
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Add the main image for this portfolio item.
                  </p>
                </div>

                {!preview ? (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-6 py-12 text-center transition hover:border-[#d7ad55] hover:bg-[#faf8f2]">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                      <ImagePlus size={22} />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      Upload an image
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      PNG, JPG or WEBP
                    </p>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={preview}
                      alt="Portfolio preview"
                      className="h-80 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-md transition hover:bg-white"
                      aria-label="Remove image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </section>
            </div>

            {/* Side panel */}
            <div className="space-y-6">
              {/* Visibility */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-[#06151b]">
                  Visibility
                </h2>

                <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                      className="mt-0.5 h-4 w-4 accent-[#b58a32]"
                    />

                    <span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                        <Star size={14} className="text-[#b58a32]" />
                        Featured work
                      </span>

                      <span className="mt-1 block text-[11px] leading-5 text-slate-500">
                        Featured work can appear in highlighted sections across
                        the website.
                      </span>
                    </span>
                  </label>
                </div>
              </section>

              {/* Summary */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-[#06151b]">
                  Summary
                </h2>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className="font-medium text-emerald-600">
                      Ready to publish
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium text-slate-700">
                      {form.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Price</span>
                    <span className="font-medium text-slate-700">
                      {form.priceType === "on-request"
                        ? "On Request"
                        : form.price
                          ? `₦${Number(form.price).toLocaleString()}`
                          : "Not set"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Featured</span>
                    <span className="font-medium text-slate-700">
                      {form.featured ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#d7ad55] px-4 py-3 text-sm font-semibold text-[#06151b] transition hover:bg-[#e5c275] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}

                  {saving
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Portfolio Item"}
                </button>

                <Link
                  to="/admin/portfolio"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <X size={16} />
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PortfolioForm;
