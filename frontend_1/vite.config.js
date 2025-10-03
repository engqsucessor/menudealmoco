import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,
    allowedHosts: [
      'menudealmoco.duckdns.org',
      'menudealmoco.pt',
      'www.menudealmoco.pt',
      'localhost',
      '3.249.10.91'
    ],
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@services': path.resolve(__dirname, '../services'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove all console.* calls
        drop_debugger: true, // Remove debugger statements
      },
    },
  }
})