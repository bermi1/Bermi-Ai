import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Single warm accent on a calm neutral palette (Claude-like).
        accent: {
          DEFAULT: "#C15F3C",
          hover: "#A94F30",
          soft: "#F6E8E1",
          softdark: "#3A2A22",
        },
        surface: {
          light: "#FAF9F5",
          dark: "#1F1E1B",
          panel: "#FFFFFF",
          paneldark: "#282724",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
