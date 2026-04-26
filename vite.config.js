import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const buildDate = new Date().toISOString();

export default defineConfig({
  base: "/",
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
