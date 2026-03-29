import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sun, Moon, Zap, File, ClipboardCheck, NotepadText, Menu, X, MonitorCog } from "lucide-react";

const NAV_LINKS = [
  { icon: NotepadText, label: "About", to: "/getting-started" },
  { icon: File, label: "Documents", to: "/" },
  { icon: ClipboardCheck, label: "Reviews", to: "/reviews" },
  { icon: MonitorCog, label: "Admin", to: "/admin" },
];

const BREAKPOINT = 768;

/**
 * Navbar
 *
 * Props:
 *  - theme        : "dark" | "light"
 *  - toggleTheme  : () => void
 *  - user         : null  (logged out)
 *                 | { name: string, avatar?: string }  (logged in)
 *
 * When logged in, the user's avatar is loaded from `user.avatar`.
 * Falls back to "/avatar.png" if the field is absent.
 * Clicking the avatar navigates to /me (the user's own profile page).
 */
export default function Navbar({ theme, toggleTheme, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = Boolean(user);
  const avatarSrc = user?.avatar ?? "/avatar.png";

  // Auto-close when viewport grows past breakpoint
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);
    const handler = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-[100] w-full">
      <div className="relative w-full h-20 border-b border-white/10 bg-base-300/50 backdrop-blur-2xl transition-all duration-300 flex items-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        <div className="w-full max-w-[1440px] mx-auto px-8 flex items-center justify-between">

          {/* ── Brand ──────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95">
              <Zap size={18} className="text-primary-content fill-current" />
            </div>
            <span className="font-black text-xl tracking-tight text-base-content hidden sm:block">
              SAP <span className="text-primary">Hub</span>
            </span>
          </div>

          {/* ── Nav Links — desktop only ────────────────────────────────────── */}
          <div className="hidden md:flex flex-1 items-center gap-2 ml-12">
            {NAV_LINKS.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-500 ${isActive
                    ? "text-primary bg-primary/5 shadow-[inset_0_0_0_1px_rgba(var(--p),0.1)]"
                    : "text-base-content/40 hover:text-base-content hover:bg-white/[0.05]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className={`transition-all duration-500 ${isActive ? "drop-shadow-[0_0_8px_rgba(var(--p),0.5)]" : "group-hover:scale-110"}`} />
                    <span>{label}</span>
                    {isActive && <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent opacity-50" />}
                    {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary rounded-full shadow-[0_0_15px_var(--p)]" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* ── Right Side ─────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme toggle — always visible on desktop */}
            <button
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 text-base-content/40 hover:text-primary hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500 active:scale-90"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* ── Desktop: logged in → avatar; logged out → Login + Register ── */}
            <div className="hidden md:flex items-center gap-3">
              <div className="w-[1px] h-8 bg-white/5" />

              {isLoggedIn ? (
                /* Avatar → /me */
                <NavLink to="/me" className="group relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-b from-white/20 to-transparent">
                    <div className="w-full h-full rounded-full overflow-hidden border border-black/20">
                      <img
                        src={avatarSrc}
                        alt={user.name ?? "Profile"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                      />
                    </div>
                  </div>
                </NavLink>
              ) : (
                /* Auth buttons */
                <>
                  <NavLink
                    to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-base-100 text-base-content/60 hover:text-base-content hover:bg-white/[0.05] transition-all duration-300"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-primary-content shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all duration-300"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>

            {/* ── Mobile hamburger ───────────────────────────────────────────── */}
            <button
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 text-base-content/50 hover:text-primary hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 active:scale-90"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span className={`transition-all duration-300 ${menuOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100"}`}>
                <Menu size={20} />
              </span>
              <span className={`transition-all duration-300 ${menuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0 absolute"}`}>
                <X size={20} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Full-Screen Overlay ─────────────────────────────────────── */}
      <div
        className={`md:hidden fixed inset-0 z-[99] transition-all duration-500 ease-in-out ${menuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        style={{
          backdropFilter: theme === "dark"
            ? "blur(24px) brightness(0.6) contrast(1.2)"
            : "blur(20px) brightness(1.1) saturate(1.5)",
          WebkitBackdropFilter: theme === "dark"
            ? "blur(24px) brightness(0.6) contrast(1.2)"
            : "blur(20px) brightness(1.1) saturate(1.5)",
          background: theme === "dark"
            ? "rgba(var(--b3), 0.8)"
            : "rgba(255, 255, 255, 0.4)",
        }}
      >
        <div
          className={`flex flex-col h-full transition-all duration-500 ease-out ${menuOpen ? "translate-y-0" : "translate-y-6"}`}
        >
          {/* Mobile header */}
          <div className="h-20 flex items-center justify-between px-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap size={18} className="text-primary-content fill-current" />
              </div>
              <span className="font-black text-xl tracking-tight text-base-content">
                SAP <span className="text-primary">Hub</span>
              </span>
            </div>

            <button
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 text-base-content/50 hover:text-primary hover:bg-white/[0.08] transition-all duration-300 active:scale-90"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile nav links */}
          <div className="flex-1 flex flex-col justify-center px-8 gap-2">
            {NAV_LINKS.map(({ icon: Icon, label, to }, i) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `group relative flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-bold transition-all duration-300 ${isActive
                    ? "text-primary bg-primary/10 border border-primary/20"
                    : "text-base-content/50 hover:text-base-content hover:bg-white/[0.05] border border-transparent"
                  }`
                }
                style={{ transitionDelay: menuOpen ? `${i * 60}ms` : "0ms" }}
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive ? "bg-primary/20" : "bg-white/[0.04] group-hover:bg-white/[0.08]"}`}>
                      <Icon size={18} className={isActive ? "text-primary drop-shadow-[0_0_8px_rgba(var(--p),0.6)]" : ""} />
                    </div>
                    <span>{label}</span>
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--p),0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* ── Mobile footer: logged in vs logged out ──────────────────────── */}
          <div className="px-8 pb-10 pt-4 border-t border-white/[0.06]">
            {isLoggedIn ? (
              /* Logged in: avatar + name + theme toggle */
              <div className="flex items-center gap-4">
                <NavLink to="/me" onClick={closeMenu} className="group flex items-center gap-3 flex-1">
                  <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-b from-white/20 to-transparent shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden border border-black/20">
                      <img
                        src={avatarSrc}
                        alt={user.name ?? "Profile"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors duration-200">
                      {user.name ?? "My Profile"}
                    </span>
                    <span className="text-xs text-base-content/40">View account</span>
                  </div>
                </NavLink>

                <button
                  className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 text-base-content/50 hover:text-primary hover:bg-white/[0.08] transition-all duration-300 active:scale-90"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            ) : (
              /* Logged out: Login + Register + theme toggle */
              <div className="flex items-center gap-3">
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-base font-bold border bg-base-100 text-base-content/60 hover:text-base-content hover:bg-white/[0.05] transition-all duration-300"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-base font-bold bg-primary text-primary-content shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all duration-300"
                >
                  Register
                </NavLink>
                <button
                  className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 text-base-content/50 hover:text-primary hover:bg-white/[0.08] transition-all duration-300 active:scale-90 shrink-0"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}