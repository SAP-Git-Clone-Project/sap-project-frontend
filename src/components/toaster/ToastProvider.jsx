import { Toaster } from "react-hot-toast";

const ToastProvider = () => (
  <Toaster
    position="top-center"
    gutter={12}
    toastOptions={{
      duration: 3000,

      // ── Default ────────────────────────────────────────────────────────
      style: {
        background:   "var(--color-base-200)",
        color:        "#ffffff",
        border:       "1px solid var(--color-base-300)",
        borderRadius: "12px",
        fontSize:     "13px",
        fontWeight:   "500",
      },

      // ── Success ────────────────────────────────────────────────────────
      success: {
        style: {
          background: "#16A34Af2",  // green-600 — visible on both themes
          color:      "#ffffff",
          border:     "1px solid #15803D",
        },
        iconTheme: {
          primary:   "#ffffff",
          secondary: "#16A34A",
        },
      },

      // ── Error ──────────────────────────────────────────────────────────
      error: {
        style: {
          background: "#DC2626f2",  // red-600
          color:      "#ffffff",
          border:     "1px solid #B91C1C",
        },
        iconTheme: {
          primary:   "#ffffff",
          secondary: "#DC2626",
        },
      },

      // ── Warning ────────────────────────────────────────────────────────
      warning: {
        style: {
          background: "#D97706f2",  // amber-600
          color:      "#ffffff",
          border:     "1px solid #B45309",
        },
        iconTheme: {
          primary:   "#ffffff",
          secondary: "#D97706",
        },
      },

      // ── Info ───────────────────────────────────────────────────────────
      info: {
        style: {
          background: "#2563EBf2",  // blue-600
          color:      "#ffffff",
          border:     "1px solid #1D4ED8",
        },
        iconTheme: {
          primary:   "#ffffff",
          secondary: "#2563EB",
        },
      },

      // ── Loading ────────────────────────────────────────────────────────
      loading: {
        style: {
          background: "#475569f2",  // slate-600 — neutral, suits both themes
          color:      "#ffffff",
          border:     "1px solid #334155",
        },
        iconTheme: {
          primary:   "#ffffff",
          secondary: "#475569",
        },
      },
    }}
  />
);

export default ToastProvider;