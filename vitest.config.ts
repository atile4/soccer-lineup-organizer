import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node", // service functions don't touch the DOM
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"), // matches your @/ import alias
    },
  },
});