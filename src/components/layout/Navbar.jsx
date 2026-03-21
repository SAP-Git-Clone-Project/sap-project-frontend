import { NavLink } from "react-router-dom";
import { Sun, Moon, Bell, Search, Home, BarChart2, Users, GitBranch, Zap, User, File } from "lucide-react";

const NAV_LINKS = [
  { icon: Home,      label: "Dashboard",      to: "/"          },
  { icon: File,      label: "Documents", to: "/documents" },
  { icon: Users,     label: "Teams",     to: "/teams"     },
  { icon: BarChart2, label: "Analytics", to: "/analytics" },
];

export default function Navbar({ theme, toggleTheme }) {
  return (
    <div className="navbar bg-base-200 border-b border-base-300 px-6 sticky top-0 z-50">

      {/* ── Brand ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mr-6">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Zap size={14} className="text-primary-content" />
        </div>
        <span className="font-bold text-sm text-base-content">
          SAP <span className="text-primary">Hub</span>
        </span>
      </div>

      {/* ── Nav Links ─────────────────────────────────────────────────────── */}
      <div className="hidden md:flex gap-1">
        {NAV_LINKS.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `btn btn-ghost btn-sm gap-1.5 font-normal ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-base-content/60"
              }`
            }
          >
            <Icon size={13} /> {label}
          </NavLink>
        ))}
      </div>

      <div className="flex-1" />

      {/* ── Right Side ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* <div className="relative hidden sm:block">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
          />
          <input
            className="input input-sm input-bordered bg-base-300 pl-8 w-44 text-sm text-base-content placeholder:text-base-content/40"
            placeholder="Search…"
          />
        </div> */}

        <div className="indicator">
          <span className="indicator-item badge badge-error badge-xs" />
          <button className="btn btn-ghost btn-sm btn-circle text-base-content">
            <Bell size={15} />
          </button>
        </div>

        <button
          className="btn btn-ghost btn-sm btn-circle text-base-content"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <NavLink to="/profile" className="avatar placeholder">
    <div className="w-8 rounded-full bg-primary text-primary-content">
      <span className="text-xs font-bold">MP</span>
    </div>
      </NavLink>
      </div>
    </div>
  );
}