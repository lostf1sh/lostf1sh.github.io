/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    fontFamily: {
      sans: ['"Geist Variable"', "system-ui", "-apple-system", "sans-serif"],
      mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      "ink-crust": "rgb(var(--color-crust) / <alpha-value>)",
      "ink-base": "rgb(var(--color-base) / <alpha-value>)",
      "ink-surface": "rgb(var(--color-surface) / <alpha-value>)",
      "ink-overlay": "rgb(var(--color-overlay) / <alpha-value>)",
      "ink-subtle": "rgb(var(--color-subtle) / <alpha-value>)",
      "ink-text": "rgb(var(--color-text) / <alpha-value>)",
      "ink-accent": "rgb(var(--color-accent) / <alpha-value>)",
      "ink-mint": "rgb(var(--color-mint) / <alpha-value>)",
      "ink-red": "rgb(var(--color-red) / <alpha-value>)",
      "ink-yellow": "rgb(var(--color-yellow) / <alpha-value>)",
      "ink-blue": "rgb(var(--color-blue) / <alpha-value>)",
    },
  },
  plugins: [],
};
