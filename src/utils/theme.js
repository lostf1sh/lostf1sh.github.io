import { ref } from "vue";

const themeColors = {
    dark: "#11111b",
    light: "#dce0e8",
};

export const theme = ref("dark");

export const setTheme = (t) => {
    theme.value = t;
    const root = document.documentElement;

    // Add transition class for smooth color change
    root.classList.add("theme-transitioning");

    root.setAttribute("data-theme", t);
    root.style.colorScheme = t;
    localStorage.setItem("theme", t);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[t]);

    // Remove transition class after animation completes
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            root.classList.remove("theme-transitioning");
        });
    });
};

export const toggleTheme = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
};

// Initialize immediately on module load
const saved = localStorage.getItem("theme") || "dark";
setTheme(saved);