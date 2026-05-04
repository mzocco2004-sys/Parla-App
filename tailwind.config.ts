import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          50: "#f6f7f9",
          100: "#ebeef2",
          500: "#647082",
          700: "#303846",
          900: "#111827",
        },
        mint: {
          100: "#dff7ed",
          500: "#32b980",
          700: "#16845b",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
