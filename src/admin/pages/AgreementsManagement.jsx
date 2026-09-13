import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, FileSignature, ChevronDown, X } from "lucide-react";

const demoAgreements = [
  {
    id: "AGR-001",
    customer: "John Doe",
    phone: "0803 123 4567",
    email: "john@example.com",
    item: "Custom Agbada",
    amount: 250000,
    status: "Pending",
    date: "Sep 10, 2026",
    occasion: "Wedding",
    deliveryDate: "Oct 15, 2026",
  },
  {
    id: "AGR-002",
    customer: "Mary James",
    phone: "0806 234 5678",
    email: "mary@example.com",
    item: "Wedding Outfit",
    amount: 300000,
    status: "Accepted",
    date: "Sep 9, 2026",
    occasion: "Wedding",
    deliveryDate: "Oct 20, 2026",
  },
  {
    id: "AGR-003",
    customer: "David Paul",
    phone: "0810 345 6789",
    email: "david@example.com",
    item: "Senator Wear",
    amount: 200000,
    status: "Rejected",
    date: "Sep 7, 2026",
    occasion: "Birthday",
    deliveryDate: "Oct 10, 2026",
  },
  {
    id: "AGR-004",
    customer: "Sarah A.",
    phone: "0705 456 7890",
    email: "sarah@example.com",
    item: "Native Wear",
    amount: 180000,
    status: "Pending",
    date: "Sep 6, 2026",
    occasion: "Traditional Ceremony",
    deliveryDate: "Oct 5, 2026",
  },
  {
    id: "AGR-005",
    customer: "Emeka K.",
    phone: "0902 567 8901",
    email: "emeka@example.com",
    item: "Custom Suit",
    amount: 350000,
    status: "Accepted",
    date: "Sep 5, 2026",
    occasion: "Corporate Event",
    deliveryDate: "Sep 30, 2026",
  },
  {
    id: "AGR-006",
    customer: "Michael O.",
    phone: "0809 678 9012",
    email: "michael@example.com",
    item: "Classic Agbada",
    amount: 275000,
    status: "Pending",
    date: "Sep 4, 2026",
    occasion: "Engagement",
    deliveryDate: "Oct 12, 2026",
  },
];

const filters = ["All", "Pending", "Accepted", "Rejected"];

function formatCurrency(amount) {
  return `₦${amount.toLocaleString()}`;
}

function statusClasses(status) {
  if (status === "Accepted") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  if (status === "Rejected") {
    return "bg-red-50 text-red-700 border-red-100";
  }

  return "bg-amber-50 text-amber-700 border-amber-100";
}

function AgreementsManagement() {
  const [agreements, setAgreements] = useState(demoAgreements);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedAgreement, setSelectedAgreement] = useState(null);

  const filteredAgreements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return agreements.filter((agreement) => {
      const matchesFilter =
        activeFilter === "All" || agreement.status === activeFilter;

      const matchesSearch =
        !query ||
        agreement.customer.toLowerCase().includes(query) ||
        agreement.phone.toLowerCase().includes(query) ||
        agreement.email.toLowerCase().includes(query) ||
        agreement.id.toLowerCase().includes(query) ||
        agreement.item.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [agreements, activeFilter, search]);

  function updateStatus(id, status) {
    setAgreements((current) =>
      current.map((agreement) =>
        agreement.id === id
          ? {
              ...agreement,
              status,
            }
          : agreement,
      ),
    );

    setSelectedAgreement((current) =>
      current?.id === id
        ? {
            ...current,
            status,
          }
        : current,
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b58a32]">
              Customer Requests
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-[#06151b]">
              Agreements
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review and manage customer order agreements.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
            <FileSignature size={15} />
            {agreements.length} total agreements
          </div>
        </div>

        {/* Development notice */}
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs leading-5 text-amber-800">
            <span className="font-semibold">Development preview:</span>{" "}
            Agreement data is currently temporary mock data. This will later be
            connected to Firebase/Firestore.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customer, phone, item or reference..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#d7ad55] focus:ring-2 focus:ring-[#d7ad55]/20"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => {
                const active = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition ${
                      active
                        ? "border-[#06151b] bg-[#06151b] text-white"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredAgreements.length}
            </span>{" "}
            agreement
            {filteredAgreements.length !== 1 ? "s" : ""}
          </p>

          {(search || activeFilter !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilter("All");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#b58a32] hover:text-[#8f6b27]"
            >
              <X size={13} />
              Clear filters
            </button>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-left">
                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Customer
                  </th>

                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Item
                  </th>

                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>

                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Date
                  </th>

                  <th className="px-5 py-3.5 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAgreements.map((agreement) => (
                  <tr
                    key={agreement.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {agreement.customer}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {agreement.phone}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-slate-700">
                        {agreement.item}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {agreement.id}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-xs font-semibold text-slate-700">
                      {formatCurrency(agreement.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusClasses(
                          agreement.status,
                        )}`}
                      >
                        {agreement.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500">
                      {agreement.date}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedAgreement(agreement)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[#d7ad55] hover:text-[#b58a32]"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAgreements.length === 0 && <EmptyState />}
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 md:hidden">
          {filteredAgreements.map((agreement) => (
            <div
              key={agreement.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {agreement.customer}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {agreement.id}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusClasses(
                    agreement.status,
                  )}`}
                >
                  {agreement.status}
                </span>
              </div>

              <div className="my-4 border-t border-slate-100" />

              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Item
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-700">
                    {agreement.item}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Amount
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    {formatCurrency(agreement.amount)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Date
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {agreement.date}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Occasion
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {agreement.occasion}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAgreement(agreement)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:border-[#d7ad55] hover:text-[#b58a32]"
              >
                <Eye size={14} />
                View Agreement
              </button>
            </div>
          ))}

          {filteredAgreements.length === 0 && <EmptyState />}
        </div>
      </div>

      {/* Agreement modal */}
      {selectedAgreement && (
        <AgreementModal
          agreement={selectedAgreement}
          onClose={() => setSelectedAgreement(null)}
          onStatusChange={updateStatus}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
        <FileSignature size={21} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-700">
        No agreements found
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
        Try changing your search or clearing the current filters.
      </p>
    </div>
  );
}

function AgreementModal({ agreement, onClose, onStatusChange }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06151b]/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Modal header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#b58a32]">
              Agreement
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#06151b]">
              {agreement.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* Customer */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Customer
            </h3>

            <div className="grid gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
              <Info label="Name" value={agreement.customer} />
              <Info label="Phone" value={agreement.phone} />
              <Info label="Email" value={agreement.email} />
              <Info label="Occasion" value={agreement.occasion} />
            </div>
          </section>

          {/* Order */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Order Details
            </h3>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-xs text-slate-500">Requested Item</span>

                <span className="text-xs font-medium text-slate-800">
                  {agreement.item}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-xs text-slate-500">Agreed Amount</span>

                <span className="text-sm font-semibold text-slate-800">
                  {formatCurrency(agreement.amount)}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-slate-500">
                  Expected Delivery
                </span>

                <span className="text-xs font-medium text-slate-800">
                  {agreement.deliveryDate}
                </span>
              </div>
            </div>
          </section>

          {/* Status */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Agreement Status
            </h3>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onStatusChange(agreement.id, "Pending")}
                  className={`flex-1 rounded-lg border px-4 py-2.5 text-xs font-semibold transition ${
                    agreement.status === "Pending"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Pending
                </button>

                <button
                  type="button"
                  onClick={() => onStatusChange(agreement.id, "Accepted")}
                  className={`flex-1 rounded-lg border px-4 py-2.5 text-xs font-semibold transition ${
                    agreement.status === "Accepted"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Accept
                </button>

                <button
                  type="button"
                  onClick={() => onStatusChange(agreement.id, "Rejected")}
                  className={`flex-1 rounded-lg border px-4 py-2.5 text-xs font-semibold transition ${
                    agreement.status === "Rejected"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Reject
                </button>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Hello ${agreement.customer}, regarding agreement ${agreement.id} for ${agreement.item}.`,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-[#06151b] px-5 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#0d252d]"
            >
              Contact Customer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-700">{value}</p>
    </div>
  );
}

export default AgreementsManagement;
