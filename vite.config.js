import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/ATBxStalker_OmlineColection/", // GitHub Pages base URL
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Вимкнено для production
    minify: "esbuild", // Використовуємо esbuild (швидше ніж terser)
    rollupOptions: {
      output: {
        manualChunks: {
          // Розділяємо vendor код для кращого кешування
          "react-vendor": ["react", "react-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  json: {
    stringify: false,
  },
});
