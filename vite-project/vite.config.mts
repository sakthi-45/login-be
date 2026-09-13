//  CORRECT
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Ensure '@tailwindcss/vite' is used here

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // This activates the Tailwind v4 compilation engine
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
