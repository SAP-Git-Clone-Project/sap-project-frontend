import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Sun, Moon, Zap, Files, ClipboardCheck, House,
  UserRound, Menu, X, MonitorCog, LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { canAccessReviews } from "@/utils/canAccessReviews";
import notify from "@/components/toaster/notify";
import Notifications from "./Notifications";

const NAV_LINKS = [
  { icon: House, label: "Home", to: "/", public: true },
  { icon: Files, label: "Documents", to: "/documents", protected: true },
  { icon: ClipboardCheck, label: "Reviews", to: "/reviews", protected: true, reviewsOnly: true },
  { icon: UserRound, label: "Users", to: "/manage-users", adminOnly: true },
  { icon: MonitorCog, label: "Audit", to: "/audit-log", adminOnly: true },
];

const BREAKPOINT = 1000;

const Navbar = ({ theme, toggleTheme }) => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const [stickyAvatar, setStickyAvatar] = useState(
    localStorage.getItem("cached_avatar") || "/avatar.png"
  );

  useEffect(() => {
    if (user?.avatar) {
      setStickyAvatar(user.avatar);
      localStorage.setItem("cached_avatar", user.avatar);
    }
  }, [user]);

  // Logic to filter links based on Auth Status and Roles
  const filteredLinks = NAV_LINKS.filter(link => {
    // 1. If not logged in, only show public links
    if (!isAuthenticated) return link.public;

    // 2. "Users" and "Audit" (adminOnly) for staff or superuser (Django is_staff / is_superuser)
    if (link.adminOnly && !user?.is_superuser && !user?.is_staff) return false;

    // 3. "Reviews" — reader-only users (no staff / not superuser) cannot see the link
    if (link.reviewsOnly && !canAccessReviews(user)) return false;

    return true;
  });

  const showLoggedInUI = isAuthenticated || (isLoading && localStorage.getItem("cached_avatar"));

  const handleLogout = async () => {
    setMenuOpen(false);
    localStorage.removeItem("cached_avatar");
    await logout();
    notify.success("Logged out successfully");
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const toggleMenu = () => {
    if (window.innerWidth < BREAKPOINT) {
      setMenuOpen(prev => !prev);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-[100] w-full">
      <div className="relative w-full h-20 border-b border-white/10 bg-base-300/50 backdrop-blur-2xl flex items-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between">

          {/* ── Brand ── */}
          <Link to="/" className="flex items-center gap-3 shrink-0 hover:opacity-80 transition-opacity focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap size={18} className="text-primary-content fill-current" />
            </div>
            <span className="font-black text-xl tracking-tight text-base-content hidden sm:block">
              SAP <span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links (Using filteredLinks) ── */}
          <div className="hidden nav:flex flex-1 items-center gap-2 ml-8 mr-1">
            {filteredLinks.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-500 hover:bg-primary/20 ${isActive ? "text-primary bg-primary/5" : "text-base-content/40 hover:text-base-content hover:bg-white/[0.05]"
                  }`
                }
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 text-base-content/40 hover:text-primary hover:bg-primary/10 transition-all shrink-0"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {showLoggedInUI && <Notifications />}

            {/* ── Desktop Profile/Logout ── */}
            <div className="hidden nav:flex items-center gap-3">
              <div className="w-[1px] h-8 bg-white/5" />
              {showLoggedInUI ? (
                <div className="flex items-center gap-4">
                  <NavLink to="/profile" className="group relative">
                    <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-b from-white/20 to-transparent transition-all duration-300 
                  group-hover:ring-[3px] group-hover:ring-white/30 group-hover:ring-offset-2 group-hover:ring-offset-black">
                      <div className="w-full h-full rounded-full overflow-hidden border border-black/20">
                        <img
                          src={stickyAvatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "/avatar.png"; }}
                        />
                      </div>
                    </div>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-error/20 text-base-content hover:scale-105 hover:bg-error transition-all"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <NavLink to="/login" className="px-4 py-2 rounded-xl text-sm font-bold bg-base-100 text-base-content/60">Login</NavLink>
                  <NavLink to="/register" className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-primary-content">Register</NavLink>
                </>
              )}
            </div>

            {/* ── Mobile Menu Trigger ── */}
            <button className="nav:hidden w-10 h-10 flex items-center justify-center rounded-2xl shrink-0" onClick={toggleMenu}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU OVERLAY ── */}
      <div
        className={`fixed inset-0 z-[99] nav:hidden transition-all duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{
          background: theme === "dark" ? "rgba(0, 0, 0, 0.50)" : "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)"
        }}
      >
        <div className="flex flex-col h-full pt-20 px-8 relative overflow-y-auto">
          <button onClick={closeMenu} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10">
            <X size={22} />
          </button>

          <div className="flex-1 flex flex-col justify-center gap-2">
            {filteredLinks.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-4 text-xl font-bold px-4 py-3 rounded-xl transition-all ${isActive ? "text-primary bg-primary/10" : "text-base-content/50"
                  }`
                }
              >
                <Icon size={22} /> <span>{label}</span>
              </NavLink>
            ))}
          </div>

          <div className="pb-10 pt-4 border-t border-white/[0.06]">
            {showLoggedInUI ? (
              <div className="flex items-center justify-between">
                <NavLink to="/profile" onClick={closeMenu} className="flex items-center gap-3">
                  <img src={stickyAvatar} className="w-11 h-11 rounded-full object-cover" />
                  <span className="font-bold">{user?.username || "Profile"}</span>
                </NavLink>
                <button onClick={handleLogout} className="p-3 text-error">
                  <LogOut />
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <NavLink to="/login" onClick={closeMenu} className="flex-1 text-center py-3 rounded-xl font-bold bg-base-100">Login</NavLink>
                <NavLink to="/register" onClick={closeMenu} className="flex-1 text-center py-3 bg-primary text-primary-content rounded-xl font-bold">Register</NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;