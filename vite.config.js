import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: resolve(process.cwd(), "src"),
  base: process.env.NODE_ENV === "production" ? "/Menuverse/dist/" : "/",
  plugins: [react()],
  publicDir: resolve(process.cwd(), "public"),
  server: { port: 5173 },
  build: {
    outDir: resolve(process.cwd(), "dist"),
    emptyOutDir: true
  }
});