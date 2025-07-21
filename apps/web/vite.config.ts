import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui8kit/core': path.resolve(__dirname, '../../packages/@ui8kit/core/src'),
      '@ui8kit/blocks': path.resolve(__dirname, '../../packages/@ui8kit/blocks/src'),
      '@twblocks/blocks': path.resolve(__dirname, '../../packages/@twblocks/blocks')
    }
  },
  server: {
    port: 3000
  }
}) 