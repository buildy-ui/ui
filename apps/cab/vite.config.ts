import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui8kit/core': path.resolve(__dirname, '../../packages/@ui8kit/core/src'),
      '@ui8kit/blocks': path.resolve(__dirname, '../../packages/@ui8kit/blocks/src'),
      '@ui8kit/theme': path.resolve(__dirname, '../../packages/@ui8kit/theme/src'),
      '@ui8kit/hooks': path.resolve(__dirname, '../../packages/@ui8kit/hooks/src'),
      '@ui8kit/form': path.resolve(__dirname, '../../packages/@ui8kit/form/src')
    }
  },
  server: {
    port: 5000,
    proxy: {
      '/api/pollinations': {
        target: 'https://image.pollinations.ai',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/pollinations/, ''),
        configure: (proxy, _options) => {
          // You can inspect/modify proxy here if needed
        }
      }
    }
  }
}) 