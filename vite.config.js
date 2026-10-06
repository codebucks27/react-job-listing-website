import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import browserslistToEsbuild from "browserslist-to-esbuild";
import packageJson from "./package.json" with { type: "json" };

const productionTargets = browserslistToEsbuild(packageJson.browserslist.production);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: "build",
    target: productionTargets,
    cssTarget: productionTargets,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});
