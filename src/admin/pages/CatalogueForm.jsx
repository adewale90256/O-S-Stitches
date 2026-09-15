import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, X, Save, LoaderCircle } from "lucide-react";
import {
  createCatalogueItem,
  getCatalogueItemById,
  updateCatalogueItem,
} from "../../lib/catalogue";
import { urlFor } from "../../lib/sanityImage";
import {} from "lucide-react";

function CatalogueForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    priceType: "on-request",
    price: "",
    featured: false,
    available: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    async function loadCatalogueItem() {
      try {
        const item = await getCatalogueItemById(id);

        setForm({
          title: item.title || "",
          category: item.category || "",
          description: item.description || "",
          priceType: item.priceType || "on-request",
          price: item.price ?? "",
          featured: item.featured ?? false,
          available: item.available ?? true,
        });

        setPreview(item.image || "");

        if (item.gallery?.length) {
          setExistingGallery(item.gallery);
        }
      } catch (error) {
        console.error("Catalogue load error:", error);
        alert(error.message || "Unable to load catalogue item.");
      }
    }

    loadCatalogueItem();
  }, [id, isEditMode]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleGalleryChange(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setGalleryFiles((current) => [...current, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));

    setGalleryPreviews((current) => [...current, ...previews]);

    event.target.value = "";
  }

  function removeGalleryImage(index) {
    setGalleryFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );

    setGalleryPreviews((current) =>
      current.filter((_, previewIndex) => previewIndex !== index),
    );
  }

  function removeExistingGalleryImage(index) {
    setExistingGallery((current) =>
      current.filter((_, imageIndex) => imageIndex !== index),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);

    try {
      if (!isEditMode && !imageFile) {
        alert("Please select a main image.");
        return;
      }

      if (isEditMode) {
        await updateCatalogueItem(
          id,
          form,
          imageFile,
          galleryFiles,
          existingGallery,
        );

        alert("Catalogue item updated successfully.");
      } else {
        await createCatalogueItem(form, imageFile, galleryFiles);

        alert("Catalogue item created successfully.");
      }

      window.location.href = "/admin/catalogue";
    } catch (error) {
      console.error(
        isEditMode ? "Catalogue update error:" : "Catalogue creation error:",
        error,
      );

      alert(
        error.message ||
          (isEditMode
            ? "Unable to update catalogue item."
            : "Unable to create catalogue item."),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <Link
          to="/admin/catalogue"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-[#071a3d]"
        >
          <ArrowLeft size={15} />
          Back to Catalogue
        </Link>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d7ad55]">
            Catalogue
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-[#071a3d]">
            {isEditMode ? "Edit Catalogue Item" : "Add Catalogue Item"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? "Update this design in your public catalogue."
              : "Add a new design to your public catalogue."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#071a3d]">
              Basic Information
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Provide the main information about this design.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-xs font-medium text-[#071a3d]"
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
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#071a3d] outline-none transition placeholder:text-gray-400 focus:border-[#d7ad55] focus:ring-1 focus:ring-[#d7ad55]"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-xs font-medium text-[#071a3d]"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#071a3d] outline-none transition focus:border-[#d7ad55] focus:ring-1 focus:ring-[#d7ad55]"
              >
                <option value="">Select category</option>
                <option value="Agbada">Agbada</option>
                <option value="Traditional Wear">Traditional Wear</option>
                <option value="Ceremonial Wear">Ceremonial Wear</option>
                <option value="Native Wear">Native Wear</option>
                <option value="Custom Design">Custom Design</option>
              </select>
            </div>

            {/* Price Type */}
            <div>
              <label
                htmlFor="priceType"
                className="mb-2 block text-xs font-medium text-[#071a3d]"
              >
                Price Type
              </label>

              <select
                id="priceType"
                name="priceType"
                value={form.priceType}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#071a3d] outline-none transition focus:border-[#d7ad55] focus:ring-1 focus:ring-[#d7ad55]"
              >
                <option value="on-request">On Request</option>
                <option value="fixed">Fixed Price</option>
                <option value="starting">Starting From</option>
              </select>
            </div>

            {/* Price */}
            {form.priceType !== "on-request" && (
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-xs font-medium text-[#071a3d]"
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
                  placeholder="e.g. 250000"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#071a3d] outline-none transition placeholder:text-gray-400 focus:border-[#d7ad55] focus:ring-1 focus:ring-[#d7ad55]"
                />
              </div>
            )}

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-xs font-medium text-[#071a3d]"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="5"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the design, fabric, detailing, fit, or occasion..."
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#071a3d] outline-none transition placeholder:text-gray-400 focus:border-[#d7ad55] focus:ring-1 focus:ring-[#d7ad55]"
              />
            </div>
          </div>
        </section>

        {/* Main Image */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#071a3d]">
              Main Image
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              This image will represent the catalogue item.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[220px_1fr]">
            {/* Preview */}
            <div className="aspect-4/5 overflow-hidden rounded-lg bg-gray-100">
              {preview ? (
                <img
                  src={preview}
                  alt="Main preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-gray-400">
                  <ImagePlus size={28} />
                  <span className="mt-2 text-xs">No image selected</span>
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="flex flex-col justify-center">
              <label
                htmlFor="main-image"
                className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-[#071a3d] transition hover:bg-gray-50"
              >
                <ImagePlus size={17} />
                Choose Main Image
              </label>

              <input
                id="main-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <p className="mt-3 text-xs text-gray-400">
                JPG, PNG or WEBP. Use a high-quality image.
              </p>

              {imageFile && (
                <p className="mt-2 text-xs font-medium text-emerald-600">
                  {imageFile.name}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#071a3d]">
              Gallery Images
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Add additional images customers can view on the item details page.
            </p>
          </div>

          <label
            htmlFor="gallery"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-[#071a3d] transition hover:bg-gray-50"
          >
            <ImagePlus size={17} />
            Choose Gallery Images
          </label>

          <input
            id="gallery"
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            className="hidden"
          />

          {/* Existing Gallery Images */}
          {existingGallery.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-xs font-medium text-gray-500">
                Existing Images
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {existingGallery.map((image, index) => (
                  <div
                    key={image.asset?._ref || index}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                  >
                    <img
                      src={urlFor(image).width(600).quality(80).url()}
                      alt={`Existing gallery ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeExistingGalleryImage(index)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Gallery Images */}
          {galleryPreviews.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-xs font-medium text-gray-500">
                New Images
              </p>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {galleryPreviews.map((image, index) => (
                  <div
                    key={image}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                  >
                    <img
                      src={image}
                      alt={`New gallery ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Visibility */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#071a3d]">
              Visibility
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Control how this design appears on your website.
            </p>
          </div>

          <div className="space-y-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 accent-[#d7ad55]"
              />

              <span>
                <span className="block text-sm font-medium text-[#071a3d]">
                  Featured item
                </span>

                <span className="mt-1 block text-xs text-gray-500">
                  Highlight this design in featured catalogue sections.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 accent-[#d7ad55]"
              />

              <span>
                <span className="block text-sm font-medium text-[#071a3d]">
                  Available
                </span>

                <span className="mt-1 block text-xs text-gray-500">
                  Show this design as currently available.
                </span>
              </span>
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/catalogue"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-[#071a3d] transition hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white transition ${
              saving
                ? "cursor-not-allowed bg-[#071a3d]/60"
                : "bg-[#071a3d] hover:bg-[#0d2858]"
            }`}
          >
            {saving ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                {isEditMode ? "Update Catalogue Item" : "Save Catalogue Item"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CatalogueForm;
