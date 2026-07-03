import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://chatflow-backend-h4rb.onrender.com",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "https://chatflow-backend-h4rb.onrender.com",
        ws: true,
        changeOrigin: true,
      },
    },
  },
})