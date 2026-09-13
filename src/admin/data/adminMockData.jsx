// ============================================================
// DEMO ADMIN DATA
// ------------------------------------------------------------
// Temporary data used while the admin UI is being developed.
// This will later be replaced with Firebase/Firestore data.
// ============================================================

export const dashboardStats = [
  {
    id: "portfolio",
    label: "Total Portfolio",
    value: 12,
    description: "Published works",
    icon: "portfolio",
    iconClass: "bg-blue-50 text-blue-700",
  },
  {
    id: "catalogue",
    label: "Total Catalogue",
    value: 24,
    description: "Available pieces",
    icon: "catalogue",
    iconClass: "bg-amber-50 text-amber-700",
  },
  {
    id: "agreements",
    label: "Total Agreements",
    value: 8,
    description: "Customer agreements",
    icon: "agreements",
    iconClass: "bg-purple-50 text-purple-700",
  },
  {
    id: "pending",
    label: "Pending",
    value: 3,
    description: "Awaiting response",
    icon: "pending",
    iconClass: "bg-orange-50 text-orange-700",
  },
];

export const recentAgreements = [
  {
    id: "AGR-001",
    customer: "John Doe",
    item: "Custom Agbada",
    amount: "₦250,000",
    status: "Pending",
    date: "Sep 10, 2026",
  },
  {
    id: "AGR-002",
    customer: "Mary James",
    item: "Wedding Outfit",
    amount: "₦300,000",
    status: "Accepted",
    date: "Sep 9, 2026",
  },
  {
    id: "AGR-003",
    customer: "David Paul",
    item: "Senator Wear",
    amount: "₦200,000",
    status: "Rejected",
    date: "Sep 7, 2026",
  },
  {
    id: "AGR-004",
    customer: "Sarah A.",
    item: "Native Wear",
    amount: "₦180,000",
    status: "Pending",
    date: "Sep 6, 2026",
  },
  {
    id: "AGR-005",
    customer: "Emeka K.",
    item: "Custom Suit",
    amount: "₦350,000",
    status: "Accepted",
    date: "Sep 5, 2026",
  },
];
