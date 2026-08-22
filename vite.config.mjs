import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const portfolioRoot = resolve(process.cwd(), "public/portfolio");
const portfolioAssets = Object.fromEntries(
  readdirSync(portfolioRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [
      entry.name,
      readdirSync(resolve(portfolioRoot, entry.name), { withFileTypes: true })
        /* Files only, and only ones that are actually media.
         *
         * This mapped every directory entry, so a project folder holding a
         * sub-folder handed the gallery the folder itself as an image path.
         * auras-trend-vault has one, editorial-2026, and its detail page
         * rendered <img src=".../editorial-2026"> - a 404 and a broken
         * image on the page. Nothing recurses into the sub-folder on
         * purpose: those files are listed by hand in
         * supplementalPortfolioAssets, and picking them up automatically
         * would change what the gallery shows. */
        .filter((file) => file.isFile() && /\.(jpe?g|png|webp|avif|gif|mp4|webm)$/i.test(file.name))
        .map((file) => file.name)
        .sort()
        .map((file) => `/portfolio/${entry.name}/${file}`),
    ]),
);

export default defineConfig({
  define: {
    __PORTFOLIO_ASSETS__: JSON.stringify(portfolioAssets),
  },
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
