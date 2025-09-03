import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const QDRANT_URL = env.VITE_QDRANT_URL
  const QDRANT_KEY = env.VITE_QDRANT_KEY

  return {
    plugins: [react()],
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@ui8kit/core': path.resolve(__dirname, '../../packages/@ui8kit/core/src'),
        '@ui8kit/theme': path.resolve(__dirname, '../../packages/@ui8kit/theme/src'),
        '@ui8kit/hooks': path.resolve(__dirname, '../../packages/@ui8kit/hooks/src'),
        '@ui8kit/form': path.resolve(__dirname, '../../packages/@ui8kit/form/src')
      }
    },
    server: {
      port: 5000,
      proxy: QDRANT_URL ? {
        '/qdrant': {
          target: QDRANT_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/qdrant/, ''),
          headers: QDRANT_KEY ? { 'api-key': QDRANT_KEY } : undefined,
        }
      } : undefined,
    }
  }
}) 