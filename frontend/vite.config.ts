import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // "@" now points to the local "src" folder
      "@": path.resolve(__dirname, "src"),
      // "@shared" points to the local "shared" folder you copied
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  // The root is now the current directory
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173, // Standard Vite port
    strictPort: false,
    proxy: {
      // This bridges your Frontend (5173) to your Backend (8000)
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});