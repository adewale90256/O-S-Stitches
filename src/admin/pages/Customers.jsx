import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  FileSignature,
  LoaderCircle,
  AlertCircle,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";

import {
  getCachedAgreements,
  loadCachedAgreements,
  refreshCachedAgreements,
} from "../../lib/adminDataCache";

import brand from "../../config/brand";

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");

  // Treat Nigerian numbers written with a leading zero
  // as equivalent to the same number using country code 234.
  if (digits.startsWith("0") && digits.length === 11) {
    return `234${digits.slice(1)}`;
  }

  return digits;
}

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function getCustomerKey(customer) {
  if (customer.customerPhone) {
    return `phone:${normalizePhone(customer.customerPhone)}`;
  }

  if (customer.customerEmail) {
    return `email:${normalizeEmail(customer.customerEmail)}`;
  }

  return `name:${customer.customerName.trim().toLowerCase()}`;
}

function groupCustomers(agreements) {
  const sorted = [...agreements].sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime(),
  );

  const customers = [];

  for (const agreement of sorted) {
    const phone = normalizePhone(agreement.customerPhone);
    const email = normalizeEmail(agreement.customerEmail);

    const existing = customers.find((customer) => {
      const samePhone = phone && customer.normalizedPhone === phone;

      const sameEmail = email && customer.normalizedEmail === email;

      const noContactDetails =
        !phone &&
        !email &&
        !customer.normalizedPhone &&
        !customer.normalizedEmail &&
        customer.customerName.trim().toLowerCase() ===
          String(agreement.customerName || "")
            .trim()
            .toLowerCase();

      return Boolean(samePhone || sameEmail || noContactDetails);
    });

    if (existing) {
      existing.agreements.push(agreement);

      if (!existing.customerPhone && agreement.customerPhone) {
        existing.customerPhone = agreement.customerPhone;
        existing.normalizedPhone = phone;
      }

      if (!existing.customerEmail && agreement.customerEmail) {
        existing.customerEmail = agreement.customerEmail;
        existing.normalizedEmail = email;
      }

      if (!existing.customerName && agreement.customerName) {
        existing.customerName = agreement.customerName;
      }
    } else {
      customers.push({
        key: getCustomerKey(agreement),
        customerName: agreement.customerName || "Unnamed customer",
        customerPhone: agreement.customerPhone || "",
        customerEmail: agreement.customerEmail || "",
        normalizedPhone: phone,
        normalizedEmail: email,
        agreements: [agreement],
      });
    }
  }

  return customers;
}

function formatCurrency(value) {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

function Customers() {
  const [agreements, setAgreements] = useState(
    () => getCachedAgreements() ?? [],
  );

  const [loading, setLoading] = useState(() => getCachedAgreements() === null);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomers() {
      try {
        const items = await loadCachedAgreements();

        if (!cancelled) {
          setAgreements(items);
          setError("");
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message || "Unable to load customer information.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function refreshCustomers() {
      try {
        const items = await refreshCachedAgreements();

        if (!cancelled) {
          setAgreements(items);
          setError("");
        }
      } catch (error) {
        console.warn("Customer background refresh failed:", error);

        if (!cancelled && getCachedAgreements() === null) {
          setError("Unable to refresh customer information.");
        }
      }
    }

    loadCustomers();
    refreshCustomers();

    const intervalId = window.setInterval(refreshCustomers, 30_000);

    window.addEventListener("focus", refreshCustomers);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshCustomers();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshCustomers);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const customers = useMemo(() => groupCustomers(agreements), [agreements]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) => {
      const searchable = [
        customer.customerName,
        customer.customerPhone,
        customer.customerEmail,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [customers, search]);

  const pendingCount = agreements.filter(
    (agreement) => agreement.status === "pending",
  ).length;

  const acceptedCount = agreements.filter(
    (agreement) => agreement.status === "accepted",
  ).length;

  return (
    <div className="space-y-8 p-8">
      {/* Page heading */}
      <div>
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: brand.colors.accent }}
        >
          Customer management
        </p>

        <h1
          className="mt-2 text-2xl font-semibold tracking-tight"
          style={{ color: brand.colors.primary }}
        >
          Customers
        </h1>

        <p className="mt-2 max-w-xl text-sm text-slate-500">
          View customer contact details and track their agreement history.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Total customers
            </p>
            <Users size={17} className="text-slate-400" />
          </div>

          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {customers.length}
          </p>
        </div>

        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Pending agreements
            </p>
            <FileSignature size={17} className="text-amber-500" />
          </div>

          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {pendingCount}
          </p>
        </div>

        <div className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Accepted agreements
            </p>
            <FileSignature size={17} className="text-emerald-600" />
          </div>

          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {acceptedCount}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 border border-slate-200 bg-white px-4 py-3">
        <Search size={17} className="shrink-0 text-slate-400" />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by customer name, phone or email..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={17} />
          <p>{error}</p>
        </div>
      )}

      {/* Customer list */}
      <div className="border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Customer directory
          </h2>

          <span className="text-xs text-slate-500">
            {filteredCustomers.length}{" "}
            {filteredCustomers.length === 1 ? "customer" : "customers"}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500">
            <LoaderCircle
              size={20}
              className="animate-spin"
              style={{ color: brand.colors.accent }}
            />
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Users
              size={32}
              className="mx-auto text-slate-300"
              strokeWidth={1.5}
            />

            <p className="mt-4 text-sm font-medium text-slate-700">
              {search ? "No matching customers" : "No customers yet"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              {search
                ? "Try another name, phone number or email address."
                : "Customers will appear here automatically when you create agreements."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCustomers.map((customer) => {
              const isExpanded = expandedCustomer === customer.key;

              const customerPending = customer.agreements.filter(
                (agreement) => agreement.status === "pending",
              ).length;

              const latestAgreement = customer.agreements[0];

              const totalValue = customer.agreements.reduce(
                (total, agreement) => total + Number(agreement.price || 0),
                0,
              );

              return (
                <div key={customer.key}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCustomer(isExpanded ? null : customer.key)
                    }
                    className="flex w-full flex-col gap-4 px-5 py-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#06151b]/5 text-[#06151b]">
                        <Users size={18} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {customer.customerName}
                        </h3>

                        <div className="mt-2 space-y-1.5">
                          {customer.customerPhone && (
                            <p className="flex items-center gap-2 break-all text-xs text-slate-500">
                              <Phone size={13} className="shrink-0" />
                              {customer.customerPhone}
                            </p>
                          )}

                          {customer.customerEmail && (
                            <p className="flex items-center gap-2 break-all text-xs text-slate-500">
                              <Mail size={13} className="shrink-0" />
                              {customer.customerEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-semibold text-slate-900">
                          {customer.agreements.length}{" "}
                          {customer.agreements.length === 1
                            ? "agreement"
                            : "agreements"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatCurrency(totalValue)} total
                        </p>

                        {customerPending > 0 && (
                          <p className="mt-1 text-[10px] text-amber-600">
                            {customerPending} pending
                          </p>
                        )}
                      </div>

                      {isExpanded ? (
                        <ChevronUp size={17} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={17} className="text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Agreement history */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-8">
                      <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Agreement history
                      </h4>

                      <div className="space-y-3">
                        {customer.agreements.map((agreement) => (
                          <div
                            key={agreement.id}
                            className="border border-slate-200 bg-white p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <p className="whitespace-pre-wrap text-sm font-medium leading-6 text-slate-800">
                                  {agreement.itemDescription}
                                </p>

                                <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                                  <CalendarDays size={13} />
                                  Created {formatDate(agreement.createdAt)}
                                </p>
                              </div>

                              <div className="shrink-0 sm:text-right">
                                <p className="text-sm font-semibold text-slate-900">
                                  {formatCurrency(agreement.price)}
                                </p>

                                <span
                                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${getStatusClasses(
                                    agreement.status,
                                  )}`}
                                >
                                  {agreement.status || "pending"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {latestAgreement && (
                        <p className="mt-4 text-[10px] text-slate-400">
                          Most recent agreement:{" "}
                          {formatDate(latestAgreement.createdAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
