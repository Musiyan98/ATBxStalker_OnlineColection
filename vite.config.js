import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Вимкнено для production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Видаляємо console.log
        drop_debugger: true,
      },
    },
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
