import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1180px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        salon: {
          rose: "#b76e79",
          blush: "#fff1f3",
          gold: "#d4af37",
          champagne: "#f7e7ce",
          ivory: "#fffaf4",
          espresso: "#18100d"
        }
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-poppins)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(183, 110, 121, 0.24)",
        luxury: "0 18px 60px rgba(24, 16, 13, 0.12)"
      },
      backgroundImage: {
        "rose-gold": "linear-gradient(135deg, #b76e79 0%, #d4af37 55%, #f7e7ce 100%)",
        "soft-radial": "radial-gradient(circle at top left, rgba(183,110,121,.22), transparent 34%), radial-gradient(circle at bottom right, rgba(212,175,55,.22), transparent 32%)"
      }
    }
  },
  plugins: []
};

export default config;
