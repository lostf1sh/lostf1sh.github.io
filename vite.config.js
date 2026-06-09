import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { getPosts } from "./scripts/posts.mjs";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

const POSTS_MANIFEST_ID = "virtual:posts-manifest";
const RESOLVED_POSTS_MANIFEST_ID = "\0" + POSTS_MANIFEST_ID;

const postsManifestPlugin = () => ({
  name: "posts-manifest",
  resolveId(id) {
    if (id === POSTS_MANIFEST_ID) return RESOLVED_POSTS_MANIFEST_ID;
  },
  async load(id) {
    if (id === RESOLVED_POSTS_MANIFEST_ID) {
      const posts = await getPosts(rootDir);
      return `export const posts = ${JSON.stringify(posts)};`;
    }
  },
  handleHotUpdate({ file, server, modules }) {
    if (file.replace(/\\/g, "/").includes("/posts/") && file.endsWith(".md")) {
      const mod = server.moduleGraph.getModuleById(RESOLVED_POSTS_MANIFEST_ID);
      if (mod) return [mod, ...modules];
    }
  },
  async generateBundle() {
    const posts = await getPosts(rootDir);
    this.emitFile({
      type: "asset",
      fileName: "posts-manifest.json",
      source: JSON.stringify(posts),
    });
  },
});

export default defineConfig({
  base: "/",
  plugins: [vue(), postsManifestPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
