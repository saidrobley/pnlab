import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "var(--bg)",
          card: "var(--bg-card)",
          elevated: "var(--bg-elevated)",
        },
        border: "var(--border)",
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
          dim: "var(--text-dim)",
        },
        green: {
          DEFAULT: "var(--green)",
          dim: "var(--green-dim)",
        },
        red: {
          DEFAULT: "var(--red)",
          dim: "var(--red-dim)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          dim: "var(--accent-dim)",
        },
        yellow: "var(--yellow)",
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
