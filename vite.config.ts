// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      // nyní /api/... → http://is_backend_c:8000/api/...
      '/api': {
        target: 'http://is_backend_c:8000',
        changeOrigin: true,
        // odstranit rewrite
        // rewrite: path => path.replace(/^\/api/, '')
      },
    },
  },
})
