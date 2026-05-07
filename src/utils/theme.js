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

// Initialize ref only — inline <script> in index.html already sets data-theme + colorScheme.
// Calling setTheme() here would trigger redundant DOM mutations + RAF cycle during initial render.
const saved = localStorage.getItem("theme") || "dark";
theme.value = saved;