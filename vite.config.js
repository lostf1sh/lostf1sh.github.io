import path from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { generateSeoAssets, renderSeoAssets } from "./scripts/seo-assets.mjs";

const buildDate = new Date().toISOString();
const rootDir = fileURLToPath(new URL(".", import.meta.url));

const seoAssetsPlugin = () => ({
  name: "seo-assets",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url?.split("?")[0];
      if (!url || !["/rss.xml", "/sitemap.xml", "/robots.txt"].includes(url)) {
        next();
        return;
      }

      try {
        const assets = await renderSeoAssets(rootDir);
        const filename = url.slice(1);
        const body = assets[filename];
        const contentType = filename.endsWith(".txt") ? "text/plain; charset=utf-8" : "application/xml; charset=utf-8";

        res.setHeader("Content-Type", contentType);
        res.end(body);
      } catch (error) {
        next(error);
      }
    });
  },
  async closeBundle() {
    await generateSeoAssets(rootDir, path.join(rootDir, "dist"));
  },
});

export default defineConfig({
  base: "/",
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  plugins: [vue(), seoAssetsPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
