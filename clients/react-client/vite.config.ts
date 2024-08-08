import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "@assets": path.resolve(__dirname, "../src/assets"),
      "@events": path.resolve(__dirname, "../src/events"),
      "@services": path.resolve(__dirname, "../src/services"),
      "@components": path.resolve(__dirname, "../src/components"),
      "@pages": path.resolve(__dirname, "../src/pages"),
      "@styles": path.resolve(__dirname, "../src/styles"),
      "@languages": path.resolve(__dirname, "../src/languages"),
    },
  },
  server: {
    host: true,
    port: 5000,
  },
});
