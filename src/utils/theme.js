import { ref } from "vue";

const themeColors = {
    dark: "#11111b",
    light: "#dce0e8",
};

export const theme = ref("dark");

export const setTheme = (t) => {
    theme.value = t;
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.style.colorScheme = t;
    localStorage.setItem("theme", t);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[t]);
};

export const toggleTheme = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
};

// Initialize immediately on module load
const saved = localStorage.getItem("theme") || "dark";
setTheme(saved);
