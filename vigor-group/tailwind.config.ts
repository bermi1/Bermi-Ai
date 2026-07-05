import type { Config } from "tailwindcss";

/**
 * ---------------------------------------------------------------------------
 * PLACEHOLDER BRAND SYSTEM — pending Vigor Group's official brand guidelines.
 * ---------------------------------------------------------------------------
 * Palette rationale (see README > "Brand & design"):
 *   - `ink`   deep indigo/teal  → coastal Zanzibar + institutional trust
 *   - `gold`  warm gold / sand  → heritage, hospitality, founding-family legacy
 *   - `sand`  off-white ground  → clean, warm, non-corporate background
 * Swap these hex values (and the fonts in app/layout.tsx) when real assets land.
 * ---------------------------------------------------------------------------
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // Deep indigo/teal primary
        ink: {
          50: "#eef4f5",
          100: "#d3e2e5",
          200: "#a7c6cb",
          300: "#6f9ea6",
          400: "#437982",
          500: "#2c5b64",
          600: "#1f454d",
          700: "#173840",
          800: "#112d34",
          900: "#0c2329",
          950: "#07161a",
        },
        // Warm gold / sand accent
        gold: {
          50: "#fbf6ec",
          100: "#f4e7cd",
          200: "#e9cd98",
          300: "#ddb268",
          400: "#d29a44",
          500: "#c1802b",
          600: "#a86722",
          700: "#864d1f",
          800: "#6f3f20",
          900: "#5e351f",
        },
        // Off-white / sand backgrounds
        sand: {
          50: "#fdfbf7",
          100: "#faf6ee",
          200: "#f3ecdd",
          300: "#e9ddc6",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(12, 35, 41, 0.04), 0 12px 32px -12px rgba(12, 35, 41, 0.18)",
        lift: "0 8px 20px -6px rgba(12, 35, 41, 0.28)",
      },
      keyframes: {
        "gradient-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(-3%, 2%, 0) scale(1.08)" },
        },
      },
      animation: {
        "gradient-drift": "gradient-drift 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
