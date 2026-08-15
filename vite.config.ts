import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // The static assets live in a "Public" folder (capital P). Vite's default
  // publicDir is lowercase "public" which works on Windows (case-insensitive)
  // but silently breaks on Linux deployments (Vercel). Set it explicitly so
  // /logoWhite/*, /images/* etc. are always copied into the build output.
  publicDir: "Public",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },

  server: {
    host: "localhost",
    port: 3000,

    
    hmr: true,

    watch:
      process.env.DISABLE_HMR === "true"
        ? {
            ignored: ["**/*"],
          }
        : undefined,
  },

  build: {
    chunkSizeWarningLimit: 2000,

    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "EVAL") {
          return;
        }

        warn(warning);
      },
    },
  },
});