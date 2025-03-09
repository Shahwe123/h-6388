
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "#1A1F2C",
        secondary: "#403E43",
        accent: "#D946EF",
        neon: {
          pink: "#F97316",
          blue: "#0EA5E9",
          purple: "#8B5CF6",
          green: "#10B981",
        },
        neutral: {
          50: "#FAFAF8",
          100: "#F0EFEA",
          200: "#E6E4DD",
          300: "#C4C3BB",
          400: "#A3A299",
          500: "#605F5B",
          600: "#3A3935",
          700: "#23241F",
          800: "#191919",
          900: "#141413",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 5px #D946EF, 0 0 15px #D946EF' },
          '50%': { textShadow: '0 0 20px #D946EF, 0 0 30px #D946EF' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse": "pulse 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        'hero-pattern': "url('/lovable-uploads/f85054f1-73fb-4801-ad6a-b98da6f62038.png')",
        'gradient-game': 'linear-gradient(90deg, #D946EF 0%, #8B5CF6 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
