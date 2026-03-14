/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        // Only keep what has NO DaisyUI semantic equivalent
        purple: "#8B5CF6",
        teal: "#14B8A6",

        // Only glass colors that can't be replaced with bg-primary/10 etc.
        glass: {
          purple: "#8B5CF61A",
          teal: "#14B8A61A",
          white: "#FFFFFF1A", // useful on colored/image backgrounds
          dark: "#0F172A33", // dark overlay utility
        },
      },
    },
  },

  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        light: {
          primary: "#2563EB",
          "primary-content": "#ffffff",
          secondary: "#475569",
          "secondary-content": "#ffffff",
          accent: "#F59E0B",
          "accent-content": "#1a1100",
          neutral: "#1F2937",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#F8FAFC",
          "base-300": "#E2E8F0",
          "base-content": "#1F2937",
          info: "#60A5FA",
          success: "#22C55E",
          warning: "#FBBF24",
          error: "#EF4444",
        },

        dark: {
          primary: "#3B82F6",
          "primary-content": "#ffffff",
          secondary: "#94A3B8",
          "secondary-content": "#0F172A",
          accent: "#F59E0B",
          "accent-content": "#1a1100",
          neutral: "#111827",
          "neutral-content": "#E5E7EB",
          "base-100": "#0F172A",
          "base-200": "#1E293B",
          "base-300": "#334155",
          "base-content": "#ffffff",
          info: "#60A5FA",
          success: "#22C55E",
          warning: "#FBBF24",
          error: "#EF4444",
        },
      },
    ],

    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
};

// ─── DaisyUI Semantic (auto-swaps light/dark) ─────────────────────────────────

// bg-primary        text-primary        border-primary
// → Main actions, CTAs, active states, links, focus rings
// → Buttons: btn-primary | Badges: badge-primary

// bg-primary-content  text-primary-content
// → Text/icons sitting ON a bg-primary surface (always white in your config)

// bg-secondary      text-secondary      border-secondary
// → Muted labels, subheadings, inactive nav items, helper text
// → Replaces any "gray" text need

// bg-secondary-content  text-secondary-content
// → Text sitting ON a bg-secondary surface

// bg-accent         text-accent         border-accent
// → Highlights, warnings-that-aren't-errors, star ratings, tags
// → Your orange — use sparingly for visual emphasis

// bg-accent-content  text-accent-content
// → Text sitting ON a bg-accent surface (dark brown in your config)

// bg-neutral        text-neutral        border-neutral
// → Darkest backgrounds, code blocks, terminal-style surfaces

// bg-neutral-content  text-neutral-content
// → Text sitting ON a bg-neutral surface

// bg-base-100       → Page background (white / #0F172A)
// bg-base-200       → Card backgrounds, sidebars, navbar
// bg-base-300       → Table headers, input backgrounds, dividers, nested surfaces
// text-base-content → All body text, headings, labels — the default readable color

// text-base-content/50  → Muted/secondary text, timestamps, placeholders
// text-base-content/60  → Slightly less muted — subheadings, inactive tabs
// text-base-content/70  → Form labels, descriptions

// bg-info           text-info           → Informational states, blue badges
// bg-success        text-success        → Pass, merge, active, positive delta
// bg-warning        text-warning        → Caution, behind, slow pipeline
// bg-error          text-error          → Failures, destructive actions, conflicts

// Soft semantic backgrounds (no custom color needed):
// bg-info/15    bg-success/15    bg-warning/15    bg-error/15

// ─── Custom Tailwind (no DaisyUI equivalent) ──────────────────────────────────

// bg-purple   text-purple   border-purple
// → Feature branches, AI/ML tags, secondary category color

// bg-teal     text-teal     border-teal
// → DevOps, infrastructure, third category color

// Soft versions (use opacity modifier):
// bg-purple/15   bg-purple/20   text-purple
// bg-teal/15     bg-teal/20     text-teal

// ─── Glass (transparent overlays only) ───────────────────────────────────────

// bg-glass-purple  → Tinted card surface for purple-category items
// bg-glass-teal    → Tinted card surface for teal-category items
// bg-glass-white   → Text/button overlay on hero gradients or images
// bg-glass-dark    → Dark scrim over light backgrounds

// These replace the removed glass colors:
// bg-primary/10    → Was glass-primary  (blue tinted surface)
// bg-accent/10     → Was glass-accent   (orange tinted surface)
// bg-secondary/15  → Was glass-gray     (gray tinted surface)
