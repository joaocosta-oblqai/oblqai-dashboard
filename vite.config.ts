import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  // Served from https://jccosta94.github.io/oblqai-dashboard/
  base: '/oblqai-dashboard/',
  plugins: [react(), tailwindcss()],
})
