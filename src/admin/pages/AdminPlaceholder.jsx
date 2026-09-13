import {
  BriefcaseBusiness,
  ShoppingBag,
  FileSignature,
  Clock3,
  MoreHorizontal,
  Eye,
  ChevronRight,
} from "lucide-react";

import { dashboardStats, recentAgreements } from "../data/adminMockData";

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

function AdminDashboard() {
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

        <p className="text-[10px] text-slate-400">September 12, 2026</p>
      </div>

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
                    {stat.value}
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

            <button
              type="button"
              className="flex items-center gap-1 text-[9px] font-semibold text-[#06151b] transition hover:text-[#b58a32]"
            >
              View All
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-[8px] font-semibold uppercase tracking text-slate-400">
                    Customer
                  </th>

                  <th className="px-4 py-3 text-left text-[8px] font-semibold uppercase tracking text-slate-400">
                    Item
                  </th>

                  <th className="px-4 py-3 text-left text-[8px] font-semibold uppercase tracking text-slate-400">
                    Amount
                  </th>

                  <th className="px-4 py-3 text-left text-[8px] font-semibold uppercase tracking text-slate-400">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-[8px] font-semibold uppercase tracking text-slate-400">
                    Date
                  </th>

                  <th className="px-5 py-3 text-right text-[8px] font-semibold uppercase tracking text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentAgreements.map((agreement) => (
                  <tr
                    key={agreement.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-800">
                          {agreement.customer}
                        </p>

                        <p className="mt-0.5 text-[8px] text-slate-400">
                          {agreement.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-[10px] text-slate-600">
                      {agreement.item}
                    </td>

                    <td className="px-4 py-3.5 text-[10px] font-semibold text-slate-700">
                      {agreement.amount}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-[8px] font-semibold ${getStatusClasses(
                          agreement.status,
                        )}`}
                      >
                        {agreement.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-[9px] text-slate-500">
                      {agreement.date}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-[#06151b]"
                          aria-label={`View ${agreement.id}`}
                        >
                          <Eye size={13} />
                        </button>

                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-[#06151b]"
                          aria-label={`More actions for ${agreement.id}`}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {recentAgreements.map((agreement) => (
              <div key={agreement.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-800">
                      {agreement.customer}
                    </p>

                    <p className="mt-1 text-[9px] text-slate-500">
                      {agreement.item}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-semibold ${getStatusClasses(
                      agreement.status,
                    )}`}
                  >
                    {agreement.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-[#06151b]">
                      {agreement.amount}
                    </p>

                    <p className="mt-1 text-[8px] text-slate-400">
                      {agreement.date} · {agreement.id}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                    aria-label={`View ${agreement.id}`}
                  >
                    <Eye size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Development note */}
      <div className="mt-5 rounded-lg border border-dashed border-[#d7ad55]/50 bg-[#d7ad55]/5 px-4 py-3">
        <p className="text-[9px] leading-relaxed text-slate-500">
          <span className="font-semibold text-[#8c6825]">
            Development preview:
          </span>{" "}
          Dashboard statistics and agreements are currently using temporary mock
          data. They will be connected to Firebase/Firestore later.
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
