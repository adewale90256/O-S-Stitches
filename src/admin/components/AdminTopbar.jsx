import { Menu, Bell, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

function AdminTopbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open admin menu"
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>

        <div>
          <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400">
            O-S Stitches
          </p>

          <h1 className="text-sm font-semibold text-[#06151b]">Admin Panel</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Visit website */}
        <Link
          to="/"
          className="hidden items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-[10px] font-medium text-slate-600 transition hover:border-[#d7ad55] hover:text-[#06151b] sm:flex"
        >
          <ExternalLink size={13} />
          View Website
        </Link>

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-[#06151b]"
          aria-label="Notifications"
        >
          <Bell size={16} strokeWidth={1.8} />

          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d7ad55]" />
        </button>

        {/* User */}
        <div className="hidden items-center gap-2 border-l border-slate-200 pl-4 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#06151b] text-[10px] font-semibold text-white">
            OS
          </div>

          <div className="leading-none">
            <p className="text-[10px] font-semibold text-slate-800">
              O-S Stitches
            </p>

            <p className="mt-1 text-[8px] text-slate-400">Designer</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
