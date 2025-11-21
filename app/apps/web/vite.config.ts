import { defineConfig } from 'vite'
import path from "path"
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
      alias: {
      "@": path.resolve(__dirname, "./src"),
      "@packages": path.resolve(__dirname, "../../packages")
      },
  },
})