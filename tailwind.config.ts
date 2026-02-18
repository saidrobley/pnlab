import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0a0b",
          card: "#111113",
          elevated: "#18181b",
        },
        border: "#27272a",
        text: {
          DEFAULT: "#fafafa",
          muted: "#71717a",
          dim: "#52525b",
        },
        green: {
          DEFAULT: "#22c55e",
          dim: "rgba(34, 197, 94, 0.15)",
        },
        red: {
          DEFAULT: "#ef4444",
          dim: "rgba(239, 68, 68, 0.15)",
        },
        accent: {
          DEFAULT: "#a78bfa",
          dim: "rgba(167, 139, 250, 0.12)",
        },
        yellow: "#facc15",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "monospace"],
        serif: ["var(--font-instrument)", "serif"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        terminalLine: {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-out",
        "fadeUp-1": "fadeUp 0.8s ease-out 0.1s both",
        "fadeUp-2": "fadeUp 0.8s ease-out 0.2s both",
        "fadeUp-3": "fadeUp 0.8s ease-out 0.3s both",
        "fadeUp-5": "fadeUp 0.8s ease-out 0.5s both",
        pulse: "pulse 2s infinite",
        "terminal-1": "terminalLine 0.4s ease-out 0.8s forwards",
        "terminal-2": "terminalLine 0.4s ease-out 1s forwards",
        "terminal-3": "terminalLine 0.4s ease-out 1.2s forwards",
        "terminal-4": "terminalLine 0.4s ease-out 1.4s forwards",
        "terminal-5": "terminalLine 0.4s ease-out 1.6s forwards",
        "terminal-6": "terminalLine 0.4s ease-out 1.8s forwards",
        "terminal-7": "terminalLine 0.4s ease-out 2s forwards",
        "terminal-divider": "terminalLine 0.4s ease-out 1.6s forwards",
        "terminal-insight": "terminalLine 0.6s ease-out 2.4s forwards",
      },
    },
  },
  plugins: [],
};
export default config;
