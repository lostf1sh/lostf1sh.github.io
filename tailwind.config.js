/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    fontFamily: {
      serif: ['"Cormorant Garamond"', "Georgia", "serif"],
      sans: ['"Karla"', '"Helvetica Neue"', "Arial", "sans-serif"],
      mono: ['"JetBrains Mono"', "monospace"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      "catppuccin-crust": "rgb(var(--color-crust) / <alpha-value>)",
      "catppuccin-base": "rgb(var(--color-base) / <alpha-value>)",
      "catppuccin-surface": "rgb(var(--color-surface) / <alpha-value>)",
      "catppuccin-overlay": "rgb(var(--color-overlay) / <alpha-value>)",
      "catppuccin-subtle": "rgb(var(--color-subtle) / <alpha-value>)",
      "catppuccin-text": "rgb(var(--color-text) / <alpha-value>)",
      "catppuccin-gold": "rgb(var(--color-gold) / <alpha-value>)",
      "catppuccin-pink": "rgb(var(--color-pink) / <alpha-value>)",
      "catppuccin-mauve": "rgb(var(--color-mauve) / <alpha-value>)",
      "catppuccin-red": "rgb(var(--color-red) / <alpha-value>)",
      "catppuccin-yellow": "rgb(var(--color-yellow) / <alpha-value>)",
      "catppuccin-peach": "rgb(var(--color-peach) / <alpha-value>)",
      "catppuccin-green": "rgb(var(--color-green) / <alpha-value>)",
      "catppuccin-blue": "rgb(var(--color-blue) / <alpha-value>)",
      "catppuccin-gray": "rgb(var(--color-gray) / <alpha-value>)",
    },
  },
  plugins: [],
};
