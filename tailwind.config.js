/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  theme: {
    fontFamily: {
      sans: ['"JetBrains Mono"', "monospace"],
      mono: ['"JetBrains Mono"', "monospace"],
    },
    colors: {
      "catppuccin-crust": "#11111b",
      "catppuccin-base": "#1e1e2e",
      "catppuccin-surface": "#313244",
      "catppuccin-overlay": "#45475a",
      "catppuccin-subtle": "#9399b2",
      "catppuccin-text": "#cdd6f4",
      "catppuccin-gold": "#fabd2f",
      "catppuccin-pink": "#f5c2e7",
      "catppuccin-mauve": "#cba6f7",
      "catppuccin-red": "#f38ba8",
      "catppuccin-yellow": "#f9e2af",
      "catppuccin-green": "#a6e3a1",
      "catppuccin-blue": "#89b4fa",
      "catppuccin-gray": "#a6adc8",
    },
  },
  plugins: [],
};
