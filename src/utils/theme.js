import { ref } from "vue";

const themeColors = {
    dark: "#0e0e0e",
    light: "#f5f5f5",
};

export const theme = ref("dark");

const getStoredTheme = () => {
    try {
        return localStorage.getItem("theme") || "dark";
    } catch {
        return "dark";
    }
};

const storeTheme = (t) => {
    try {
        localStorage.setItem("theme", t);
    } catch {
    }
};

export const setTheme = (t) => {
    theme.value = t;
    const root = document.documentElement;

    root.classList.add("theme-transitioning");

    root.setAttribute("data-theme", t);
    root.style.colorScheme = t;
    storeTheme(t);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[t]);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            root.classList.remove("theme-transitioning");
        });
    });
};

export const toggleTheme = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
};

const saved = getStoredTheme();
theme.value = saved;
