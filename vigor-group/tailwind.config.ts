import type { Config } from "tailwindcss";

/**
 * ---------------------------------------------------------------------------
 * VIGOR brand system — derived from the official VIGOR logo.
 * ---------------------------------------------------------------------------
 *   - `brand`     the VIGOR red (the group's core identity, from the logo)
 *   - `graphite`  the silver/charcoal from the logo mark → clean neutral UI
 *   - white / light grey grounds for a clean, modern, corporate look
 *
 * Each SUBSIDIARY / sector also carries its own accent colour (see
 * data/site.ts → sectorMeta.color) so every unit has a distinct identity
 * while red remains the unifying group colour.
 * ---------------------------------------------------------------------------
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1240px" },
    },
    extend: {
      colors: {
        // VIGOR red
        brand: {
          50: "#fef2f2",
          100: "#fde3e3",
          200: "#fbcccc",
          300: "#f7a3a3",
          400: "#f06d6d",
          500: "#e53e3e",
          600: "#d81f26", // core logo red
          700: "#b51319",
          800: "#951419",
          900: "#7c161a",
          950: "#43070a",
        },
        // Silver/charcoal neutral (the logo's grey swoosh)
        graphite: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d9dadd",
          300: "#b8babf",
          400: "#90939b",
          500: "#71747d",
          600: "#585a62",
          700: "#484950",
          800: "#2f3035",
          900: "#1c1d21",
          950: "#111114",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17, 17, 20, 0.04), 0 10px 30px -14px rgba(17, 17, 20, 0.16)",
        lift: "0 10px 28px -8px rgba(17, 17, 20, 0.22)",
        ring: "0 0 0 1px rgba(17,17,20,0.06)",
      },
      keyframes: {
        "gradient-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(-3%, 2%, 0) scale(1.08)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "gradient-drift": "gradient-drift 18s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
