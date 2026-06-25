import type { Config } from "tailwindcss";

/**
 * BUMBOX design system — "Аналоговий сигнал".
 * Warm analog-black (the shadow on magnetic tape), a single flame-red signal
 * accent drawn from the band's own logo, and a VU-meter amber. Deliberately
 * not the cold near-black + acid-green that templated dark sites default to.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0A09", // warm near-black base
          800: "#131110", // raised surface
          700: "#1C1916", // cards
          600: "#272320", // hairline edges / inset
        },
        bone: {
          DEFAULT: "#F3ECDD", // cassette-label off-white — primary text
          dim: "#BCB4A6", // secondary text
        },
        smoke: "#857C71", // muted captions / meta
        signal: {
          DEFAULT: "#F23527", // Boombox flame red — the one accent
          deep: "#B5180B", // ember
        },
        amber: "#E8A33D", // analog VU-meter gold — secondary accent
        line: "rgba(243, 236, 221, 0.10)", // hairline dividers / rings
        "line-strong": "rgba(243, 236, 221, 0.18)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Unbounded", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Manrope", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.05em",
        kicker: "0.32em",
      },
      maxWidth: {
        shell: "104rem",
      },
      transitionTimingFunction: {
        cinema: "cubic-bezier(0.16, 1, 0.3, 1)", // expo-out, the house easing
        signal: "cubic-bezier(0.83, 0, 0.17, 1)", // expo-in-out
      },
      keyframes: {
        "rec-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.82)" },
        },
        "vu-bounce": {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "grain-shift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "30%": { transform: "translate(3%, -15%)" },
          "50%": { transform: "translate(-7%, 5%)" },
          "70%": { transform: "translate(5%, 12%)" },
          "90%": { transform: "translate(-3%, 8%)" },
        },
      },
      animation: {
        "rec-pulse": "rec-pulse 1.6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
