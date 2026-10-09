import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  FileText,
  LoaderCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { createAgreement, deleteAgreement } from "../../lib/agreements";

import {
  getCachedAgreements,
  loadCachedAgreements,
  refreshCachedAgreements,
  setCachedAgreements,
} from "../../lib/adminDataCache";

import brand from "../../config/brand";

function AgreementsManagement() {
  const [agreements, setAgreements] = useState(
    () => getCachedAgreements() ?? [],
  );

  const [loading, setLoading] = useState(() => getCachedAgreements() === null);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    itemDescription: "",
    price: "",
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

  useEffect(() => {
    let cancelled = false;

    async function loadAgreements() {
      try {
        const items = await loadCachedAgreements();

        if (!cancelled) {
          setAgreements(items);
        }
      } catch (error) {
        console.error("Failed to load agreements:", error);

        if (!cancelled) {
          setNotification({
            type: "error",
            message: error.message || "Unable to load agreements.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    async function refreshAgreements() {
      try {
        const items = await refreshCachedAgreements();

        if (!cancelled) {
          setAgreements(items);
        }
      } catch (error) {
        // Preserve the existing list if a background refresh fails.
        console.warn("Agreements background refresh failed:", error);
      }
    }

    loadAgreements();
    refreshAgreements();

    const intervalId = window.setInterval(refreshAgreements, 30_000);

    window.addEventListener("focus", refreshAgreements);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshAgreements();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshAgreements);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      itemDescription: "",
      price: "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const result = await createAgreement(form);

      setAgreements((current) => {
        const updatedAgreements = [
          result.agreement,
          ...current.filter(
            (agreement) => agreement.id !== result.agreement.id,
          ),
        ];

        setCachedAgreements(updatedAgreements);

        return updatedAgreements;
      });

      resetForm();
      setShowForm(false);

      setNotification({
        type: "success",
        message: "Agreement created successfully.",
      });
    } catch (error) {
      console.error("Failed to create agreement:", error);

      setNotification({
        type: "error",
        message: error.message || "Unable to create agreement.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this agreement?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteAgreement(id);

      setAgreements((current) => {
        const updatedAgreements = current.filter(
          (agreement) => agreement.id !== id,
        );

        setCachedAgreements(updatedAgreements);

        return updatedAgreements;
      });

      setNotification({
        type: "success",
        message: "Agreement deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete agreement:", error);

      setNotification({
        type: "error",
        message: error.message || "Unable to delete agreement.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function copyAgreementLink(agreement) {
    const link = `${window.location.origin}/agreement/${agreement.agreementToken}`;

    try {
      await navigator.clipboard.writeText(link);

      setCopiedId(agreement.id);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy agreement link:", error);

      setNotification({
        type: "error",
        message: "Unable to copy agreement link.",
      });
    }
  }

  function formatCurrency(value) {
    return `₦${Number(value || 0).toLocaleString("en-NG")}`;
  }

  function getStatusClasses(status) {
    if (status === "accepted") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-600";
    }

    return "bg-amber-50 text-amber-700";
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: brand.colors.accent }}
          >
            Customer agreements
          </p>

          <h1
            className="mt-2 text-2xl font-semibold tracking-tight"
            style={{ color: brand.colors.primary }}
          >
            Agreements
          </h1>

          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Create and manage customer agreements before production begins.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition"
          style={{ backgroundColor: brand.colors.primary }}
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}

          {showForm ? "Close" : "New Agreement"}
        </button>
      </div>

      {/* Notification */}
      {notification.message && (
        <div
          className={`flex items-center gap-3 border px-4 py-3 text-sm ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {notification.type === "success" ? (
            <Check size={16} />
          ) : (
            <X size={16} />
          )}

          {notification.message}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900">
              Create Agreement
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Enter the customer and order information below.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Customer Name */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Customer Name
              </label>

              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
                placeholder="Customer full name"
                className="w-full border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d7ad55]"
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                WhatsApp / Phone
              </label>

              <input
                type="tel"
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                required
                placeholder="e.g. 08012345678"
                className="w-full border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d7ad55]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Email
              </label>

              <input
                type="email"
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleChange}
                placeholder="customer@example.com"
                className="w-full border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d7ad55]"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Total Price (₦)
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g. 500000"
                className="w-full border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d7ad55]"
              />
            </div>

            {/* Item Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Order / Outfit Description
              </label>

              <textarea
                name="itemDescription"
                value={form.itemDescription}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe the outfit or work being commissioned..."
                className="w-full resize-none border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#d7ad55]"
              />
            </div>
          </div>

          {/* Payment Summary */}
          {form.price && Number(form.price) > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="border border-slate-200 bg-slate-50 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Total
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {formatCurrency(form.price)}
                </p>
              </div>

              <div className="border border-slate-200 bg-slate-50 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  70% Upfront
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {formatCurrency(Number(form.price) * 0.7)}
                </p>
              </div>

              <div className="border border-slate-200 bg-slate-50 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  30% Balance
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {formatCurrency(Number(form.price) * 0.3)}
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: brand.colors.primary }}
            >
              {saving ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText size={15} />
                  Create Agreement
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Agreements */}
      <div className="border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Customer Agreements
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoaderCircle
              size={24}
              className="animate-spin"
              style={{ color: brand.colors.accent }}
            />
          </div>
        ) : agreements.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <FileText
              size={30}
              className="mx-auto text-slate-300"
              strokeWidth={1.5}
            />

            <p className="mt-4 text-sm font-medium text-slate-700">
              No agreements yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Create your first customer agreement to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {agreements.map((agreement) => (
              <div
                key={agreement.id}
                className="flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between"
              >
                {/* Customer */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {agreement.customerName}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${getStatusClasses(
                        agreement.status,
                      )}`}
                    >
                      {agreement.status}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {agreement.customerPhone}
                    {agreement.customerEmail
                      ? ` • ${agreement.customerEmail}`
                      : ""}
                  </p>

                  <p className="mt-2 max-w-xl text-xs leading-5 text-slate-600">
                    {agreement.itemDescription}
                  </p>
                </div>

                {/* Payment */}
                <div className="shrink-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Agreement Value
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatCurrency(agreement.price)}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    70%: {formatCurrency(agreement.upfrontAmount)}
                    {" • "}
                    30%: {formatCurrency(agreement.balanceAmount)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {agreement.status === "pending" &&
                    agreement.agreementToken && (
                      <button
                        type="button"
                        onClick={() => copyAgreementLink(agreement)}
                        className="inline-flex items-center gap-2 border border-slate-200 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                      >
                        {copiedId === agreement.id ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}

                        {copiedId === agreement.id ? "Copied" : "Copy Link"}
                      </button>
                    )}

                  <button
                    type="button"
                    onClick={() => handleDelete(agreement.id)}
                    disabled={deletingId !== null}
                    className="inline-flex items-center gap-2 border border-red-100 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-red-500 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === agreement.id ? (
                      <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}

                    {deletingId === agreement.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgreementsManagement;
