import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config


export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, 
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Express server
        changeOrigin: true,
        secure: false
      }
    }
  }
});
