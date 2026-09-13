import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ShoppingBag,
  FileSignature,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Portfolio",
    path: "/admin/portfolio",
    icon: BriefcaseBusiness,
  },
  {
    name: "Catalogue",
    path: "/admin/catalogue",
    icon: ShoppingBag,
  },
  {
    name: "Agreements",
    path: "/admin/agreements",
    icon: FileSignature,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar({ mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-[#06151b] text-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/80">
              <span className="font-serif text-sm leading-none tracking-[-0.08em]">
                OS
              </span>
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-semibold tracking-[0.18em]">
                O-S
              </span>
              <span className="mt-1 text-[6px] tracking-[0.25em] text-white/50">
                STITCHES
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Menu
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-md px-3 py-2.5 text-[11px] font-medium transition ${
                      isActive
                        ? "bg-[#d7ad55] text-[#06151b]"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={15} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[11px] font-medium text-white/50 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={15} strokeWidth={1.8} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
