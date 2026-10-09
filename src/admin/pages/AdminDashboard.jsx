import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  ShoppingBag,
  FileSignature,
  Clock3,
  MoreHorizontal,
  Eye,
  ChevronRight,
  X,
  Copy,
  ExternalLink,
  Trash2,
  Check,
} from "lucide-react";

import { deleteAgreement } from "../../lib/agreements";

import {
  getCachedPortfolio,
  getCachedCatalogue,
  getCachedAgreements,
  loadCachedPortfolio,
  loadCachedCatalogue,
  loadCachedAgreements,
  setCachedAgreements,
  refreshCachedPortfolio,
  refreshCachedCatalogue,
  refreshCachedAgreements,
} from "../../lib/adminDataCache";

const statIcons = {
  portfolio: BriefcaseBusiness,
  catalogue: ShoppingBag,
  agreements: FileSignature,
  pending: Clock3,
};

function getStatusClasses(status) {
  switch (status) {
    case "Accepted":
      return "bg-emerald-50 text-emerald-700";

    case "Pending":
      return "bg-amber-50 text-amber-700";

    case "Rejected":
      return "bg-red-50 text-red-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const numericValue =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[₦,\s]/g, ""));

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  let date;

  if (typeof value?.toDate === "function") {
    date = value.toDate();
  } else if (value?.seconds) {
    date = new Date(value.seconds * 1000);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatStatus(status) {
  if (!status) {
    return "Pending";
  }

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function getAgreementDate(agreement) {
  return (
    agreement.createdAt ||
    agreement.created_at ||
    agreement.updatedAt ||
    agreement.updated_at ||
    agreement.date ||
    agreement.createdDate
  );
}

function getAgreementId(agreement) {
  return agreement.id || agreement._id || agreement.agreementId || "—";
}

function getAgreementCustomer(agreement) {
  return (
    agreement.customerName ||
    agreement.customer ||
    agreement.name ||
    "Unknown customer"
  );
}

function getAgreementItem(agreement) {
  return (
    agreement.itemDescription || agreement.item || agreement.description || "—"
  );
}

function getAgreementPrice(agreement) {
  return agreement.price ?? agreement.amount ?? 0;
}

function AdminDashboard() {
  const [portfolioCount, setPortfolioCount] = useState(
    () => getCachedPortfolio()?.length ?? 0,
  );

  const [catalogueCount, setCatalogueCount] = useState(
    () => getCachedCatalogue()?.length ?? 0,
  );

  const [agreements, setAgreements] = useState(
    () => getCachedAgreements() ?? [],
  );

  const [loading, setLoading] = useState(
    () =>
      getCachedPortfolio() === null ||
      getCachedCatalogue() === null ||
      getCachedAgreements() === null,
  );

  const [error, setError] = useState("");
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [copiedAgreementId, setCopiedAgreementId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const [portfolioItems, catalogueItems, agreementItems] =
          await Promise.all([
            loadCachedPortfolio(),
            loadCachedCatalogue(),
            loadCachedAgreements(),
          ]);

        if (cancelled) return;

        setPortfolioCount(portfolioItems.length);
        setCatalogueCount(catalogueItems.length);
        setAgreements(agreementItems);
        setError("");
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        if (!cancelled) {
          setError(error.message || "Unable to load dashboard information.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    async function refreshDashboard() {
      try {
        const [portfolioItems, catalogueItems, agreementItems] =
          await Promise.all([
            refreshCachedPortfolio(),
            refreshCachedCatalogue(),
            refreshCachedAgreements(),
          ]);

        if (cancelled) return;

        setPortfolioCount(portfolioItems.length);
        setCatalogueCount(catalogueItems.length);
        setAgreements(agreementItems);
        setError("");
      } catch (error) {
        // Keep displaying cached data if a background refresh fails.
        console.warn("Dashboard background refresh failed:", error);
      }
    }

    loadDashboard();

    // Refresh immediately without waiting for the first interval.
    refreshDashboard();

    // Refresh every 30 seconds while the Dashboard is mounted.
    const intervalId = window.setInterval(refreshDashboard, 30_000);

    // Refresh when the admin returns to the browser tab or window.
    window.addEventListener("focus", refreshDashboard);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshDashboard();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshDashboard);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const pendingCount = agreements.filter(
    (agreement) => String(agreement.status || "").toLowerCase() === "pending",
  ).length;

  const dashboardStats = [
    {
      id: "portfolio",
      label: "Total Portfolio",
      value: portfolioCount,
      description: "Published works",
      icon: "portfolio",
      iconClass: "bg-blue-50 text-blue-700",
    },
    {
      id: "catalogue",
      label: "Total Catalogue",
      value: catalogueCount,
      description: "Available pieces",
      icon: "catalogue",
      iconClass: "bg-amber-50 text-amber-700",
    },
    {
      id: "agreements",
      label: "Total Agreements",
      value: agreements.length,
      description: "Customer agreements",
      icon: "agreements",
      iconClass: "bg-purple-50 text-purple-700",
    },
    {
      id: "pending",
      label: "Pending",
      value: pendingCount,
      description: "Awaiting response",
      icon: "pending",
      iconClass: "bg-orange-50 text-orange-700",
    },
  ];

  const recentAgreements = [...agreements]
    .sort((a, b) => {
      const dateA = getAgreementDate(a);
      const dateB = getAgreementDate(b);

      const timeA =
        typeof dateA?.toDate === "function"
          ? dateA.toDate().getTime()
          : new Date(dateA || 0).getTime();

      const timeB =
        typeof dateB?.toDate === "function"
          ? dateB.toDate().getTime()
          : new Date(dateB || 0).getTime();

      return timeB - timeA;
    })
    .slice(0, 5);

  const handleCopyAgreementLink = async (agreement) => {
    const token = agreement.agreementToken;

    if (!token) {
      console.error("Agreement token is missing.");
      return;
    }

    const link = `${window.location.origin}/agreement/${token}`;

    try {
      await navigator.clipboard.writeText(link);

      setCopiedAgreementId(getAgreementId(agreement));
      setOpenMenuId(null);

      setTimeout(() => {
        setCopiedAgreementId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy agreement link:", error);
    }
  };

  const handleOpenAgreementLink = (agreement) => {
    const token = agreement.agreementToken;

    if (!token) {
      console.error("Agreement token is missing.");
      return;
    }

    const link = `${window.location.origin}/agreement/${token}`;

    window.open(link, "_blank", "noopener,noreferrer");

    setOpenMenuId(null);
  };

  const handleDeleteAgreement = async (agreement) => {
    const id = getAgreementId(agreement);

    const confirmed = window.confirm(
      `Are you sure you want to delete the agreement for ${getAgreementCustomer(
        agreement,
      )}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setOpenMenuId(null);

      await deleteAgreement(id);

      setAgreements((currentAgreements) => {
        const updatedAgreements = currentAgreements.filter(
          (currentAgreement) => getAgreementId(currentAgreement) !== id,
        );

        setCachedAgreements(updatedAgreements);

        return updatedAgreements;
      });

      if (selectedAgreement && getAgreementId(selectedAgreement) === id) {
        setSelectedAgreement(null);
      }
    } catch (error) {
      console.error("Failed to delete agreement:", error);

      window.alert(error.message || "Unable to delete the agreement.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#b58a32]">
            Overview
          </p>

          <h2 className="text-xl font-semibold tracking-tight text-[#06151b] sm:text-2xl">
            Dashboard
          </h2>

          <p className="mt-1 text-[11px] text-slate-500">
            Welcome back, O-S Stitches!
          </p>
        </div>

        <p className="text-[10px] text-slate-400">
          {new Intl.DateTimeFormat("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date())}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-[10px] text-red-600">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = statIcons[stat.icon];

          return (
            <div
              key={stat.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-slate-400">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[#06151b]">
                    {loading ? "—" : stat.value}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-400">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-md ${stat.iconClass}`}
                >
                  <Icon size={16} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="mt-6">
        {/* Recent agreements */}
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {/* Section header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <h3 className="text-sm font-semibold text-[#06151b]">
                Recent Agreements
              </h3>

              <p className="mt-1 text-[9px] text-slate-400">
                Latest customer agreements and their current status
              </p>
            </div>

            <Link
              to="/admin/agreements"
              className="flex items-center gap-1 text-[9px] font-semibold text-[#06151b] transition hover:text-[#b58a32]"
            >
              View All
              <ChevronRight size={13} />
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-5 py-10 text-center">
              <p className="text-[10px] text-slate-400">
                Loading dashboard information...
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && recentAgreements.length === 0 && (
            <div className="px-5 py-10 text-center">
              <FileSignature
                size={24}
                className="mx-auto text-slate-300"
                strokeWidth={1.5}
              />

              <p className="mt-3 text-[10px] font-medium text-slate-500">
                No agreements yet
              </p>

              <p className="mt-1 text-[9px] text-slate-400">
                Customer agreements will appear here once they are created.
              </p>
            </div>
          )}

          {/* Desktop table */}
          {!loading && recentAgreements.length > 0 && (
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Customer
                    </th>

                    <th className="px-4 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Item
                    </th>

                    <th className="px-4 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Date
                    </th>

                    <th className="px-5 py-3 text-right text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentAgreements.map((agreement) => {
                    const id = getAgreementId(agreement);
                    const status = formatStatus(agreement.status);

                    return (
                      <tr
                        key={id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                      >
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="text-[10px] font-semibold text-slate-800">
                              {getAgreementCustomer(agreement)}
                            </p>

                            <p className="mt-0.5 text-[8px] text-slate-400">
                              {id}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-[10px] text-slate-600">
                          {getAgreementItem(agreement)}
                        </td>

                        <td className="px-4 py-3.5 text-[10px] font-semibold text-slate-700">
                          {formatCurrency(getAgreementPrice(agreement))}
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-[8px] font-semibold ${getStatusClasses(
                              status,
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-[9px] text-slate-500">
                          {formatDate(getAgreementDate(agreement))}
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedAgreement(agreement)}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-[#06151b]"
                              aria-label={`View ${id}`}
                            >
                              <Eye size={13} />
                            </button>

                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenMenuId((currentId) =>
                                    currentId === id ? null : id,
                                  )
                                }
                                disabled={deletingId === id}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-[#06151b] disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label={`More actions for ${id}`}
                                aria-expanded={openMenuId === id}
                              >
                                <MoreHorizontal size={14} />
                              </button>

                              {openMenuId === id && (
                                <div className="absolute right-0 top-9 z-30 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedAgreement(agreement);
                                      setOpenMenuId(null);
                                    }}
                                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[9px] text-slate-600 transition hover:bg-slate-50 hover:text-[#06151b]"
                                  >
                                    <Eye size={13} />
                                    View agreement
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCopyAgreementLink(agreement)
                                    }
                                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[9px] text-slate-600 transition hover:bg-slate-50 hover:text-[#06151b]"
                                  >
                                    {copiedAgreementId === id ? (
                                      <Check size={13} />
                                    ) : (
                                      <Copy size={13} />
                                    )}

                                    {copiedAgreementId === id
                                      ? "Link copied"
                                      : "Copy agreement link"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenAgreementLink(agreement)
                                    }
                                    disabled={!agreement.agreementToken}
                                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[9px] text-slate-600 transition hover:bg-slate-50 hover:text-[#06151b] disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    <ExternalLink size={13} />
                                    Open customer link
                                  </button>

                                  <div className="my-1 border-t border-slate-100" />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteAgreement(agreement)
                                    }
                                    disabled={deletingId === id}
                                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[9px] text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <Trash2 size={13} />
                                    {deletingId === id
                                      ? "Deleting..."
                                      : "Delete agreement"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile cards */}
          {!loading && recentAgreements.length > 0 && (
            <div className="divide-y divide-slate-100 md:hidden">
              {recentAgreements.map((agreement) => {
                const id = getAgreementId(agreement);
                const status = formatStatus(agreement.status);

                return (
                  <div key={id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-800">
                          {getAgreementCustomer(agreement)}
                        </p>

                        <p className="mt-1 text-[9px] text-slate-500">
                          {getAgreementItem(agreement)}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-semibold ${getStatusClasses(
                          status,
                        )}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold text-[#06151b]">
                          {formatCurrency(getAgreementPrice(agreement))}
                        </p>

                        <p className="mt-1 text-[8px] text-slate-400">
                          {formatDate(getAgreementDate(agreement))} · {id}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedAgreement(agreement)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                          aria-label={`View ${id}`}
                        >
                          <Eye size={13} />
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId((currentId) =>
                                currentId === id ? null : id,
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                            aria-label={`More actions for ${id}`}
                            aria-expanded={openMenuId === id}
                          >
                            <MoreHorizontal size={14} />
                          </button>

                          {openMenuId === id && (
                            <div className="absolute bottom-10 right-0 z-30 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAgreement(agreement);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[9px] text-slate-600 hover:bg-slate-50"
                              >
                                <Eye size={13} />
                                View agreement
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyAgreementLink(agreement)
                                }
                                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[9px] text-slate-600 hover:bg-slate-50"
                              >
                                {copiedAgreementId === id ? (
                                  <Check size={13} />
                                ) : (
                                  <Copy size={13} />
                                )}

                                {copiedAgreementId === id
                                  ? "Link copied"
                                  : "Copy agreement link"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenAgreementLink(agreement)
                                }
                                disabled={!agreement.agreementToken}
                                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[9px] text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                              >
                                <ExternalLink size={13} />
                                Open customer link
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                type="button"
                                onClick={() => handleDeleteAgreement(agreement)}
                                disabled={deletingId === id}
                                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[9px] text-red-500 hover:bg-red-50 disabled:opacity-50"
                              >
                                <Trash2 size={13} />
                                {deletingId === id
                                  ? "Deleting..."
                                  : "Delete agreement"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Agreement Details Modal */}
      {selectedAgreement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#06151b]/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedAgreement(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#b58a32]">
                  Agreement Details
                </p>

                <h3 className="mt-1 text-base font-semibold text-[#06151b]">
                  {getAgreementCustomer(selectedAgreement)}
                </h3>

                <p className="mt-1 text-[9px] text-slate-400">
                  {getAgreementId(selectedAgreement)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAgreement(null)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-[#06151b]"
                aria-label="Close agreement details"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 px-5 py-5">
              {/* Customer */}
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400">
                  Customer
                </p>

                <p className="mt-1 text-[11px] font-medium text-slate-800">
                  {getAgreementCustomer(selectedAgreement)}
                </p>
              </div>

              {/* Contact */}
              {(selectedAgreement.customerPhone ||
                selectedAgreement.phone ||
                selectedAgreement.customerEmail ||
                selectedAgreement.email) && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(selectedAgreement.customerPhone ||
                    selectedAgreement.phone) && (
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400">
                        Phone
                      </p>

                      <p className="mt-1 text-[10px] text-slate-700">
                        {selectedAgreement.customerPhone ||
                          selectedAgreement.phone}
                      </p>
                    </div>
                  )}

                  {(selectedAgreement.customerEmail ||
                    selectedAgreement.email) && (
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-[10px] text-slate-700">
                        {selectedAgreement.customerEmail ||
                          selectedAgreement.email}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Item + Amount */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400">
                    Item
                  </p>

                  <p className="mt-1 text-[10px] text-slate-700">
                    {getAgreementItem(selectedAgreement)}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400">
                    Amount
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-[#06151b]">
                    {formatCurrency(getAgreementPrice(selectedAgreement))}
                  </p>
                </div>
              </div>

              {/* Status + Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-1 text-[8px] font-semibold ${getStatusClasses(
                      formatStatus(selectedAgreement.status),
                    )}`}
                  >
                    {formatStatus(selectedAgreement.status)}
                  </span>
                </div>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 text-[10px] text-slate-700">
                    {formatDate(getAgreementDate(selectedAgreement))}
                  </p>
                </div>
              </div>

              {/* Description */}
              {(selectedAgreement.itemDescription ||
                selectedAgreement.description) && (
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-widest text-slate-400">
                    Description
                  </p>

                  <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
                    <p className="whitespace-pre-wrap text-[10px] leading-relaxed text-slate-600">
                      {selectedAgreement.itemDescription ||
                        selectedAgreement.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-5 py-3">
              <button
                type="button"
                onClick={() => setSelectedAgreement(null)}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-[9px] font-semibold uppercase tracking-widest text-slate-600 transition hover:border-slate-300 hover:text-[#06151b]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
