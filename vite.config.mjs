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
      readdirSync(resolve(portfolioRoot, entry.name))
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
