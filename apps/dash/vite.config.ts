import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const QDRANT_URL = env.VITE_QDRANT_URL
  const QDRANT_KEY = env.VITE_QDRANT_KEY
  const EMB_URL = env.VITE_EMBEDDING_URL
  const EMB_KEY = env.VITE_EMBEDDING_KEY
  const OPENROUTER_URL = env.OPENROUTER_URL
  const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY

  return {
    plugins: [react()],
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@ui8kit/core': path.resolve(__dirname, '../../packages/@ui8kit/core/src'),
        '@ui8kit/theme': path.resolve(__dirname, '../../packages/@ui8kit/theme/src'),
        '@ui8kit/hooks': path.resolve(__dirname, '../../packages/@ui8kit/hooks/src'),
        '@ui8kit/form': path.resolve(__dirname, '../../packages/@ui8kit/form/src'),
        '@ui8kit/flow': path.resolve(__dirname, '../../packages/@ui8kit/flow/src'),
        '@ui8kit/chat': path.resolve(__dirname, '../../packages/@ui8kit/chat/src'),
      }
    },
    server: {
      port: 5000,
      proxy: (() => {
        const proxy: Record<string, any> = {}
        if (QDRANT_URL) {
          proxy['/qdrant'] = {
            target: QDRANT_URL,
            changeOrigin: true,
            secure: true,
            rewrite: (p: string) => p.replace(/^\/qdrant/, ''),
            headers: QDRANT_KEY ? { 'api-key': QDRANT_KEY } : undefined,
          }
        }
        if (EMB_URL) {
          proxy['/emb'] = {
            target: EMB_URL,
            changeOrigin: true,
            secure: true,
            rewrite: (p: string) => p.replace(/^\/emb/, ''),
            headers: EMB_KEY ? { 'authorization': `Bearer ${EMB_KEY}` } : undefined,
          }
        }
        if (OPENROUTER_URL) {
          proxy['/llm'] = {
            target: OPENROUTER_URL,
            changeOrigin: true,
            secure: true,
            rewrite: (p: string) => p.replace(/^\/llm/, ''),
            headers: OPENROUTER_API_KEY ? {
              'authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'content-type': 'application/json',
              'x-title': 'buildy-dash',
            } : { 'content-type': 'application/json' },
          }
        }
        return Object.keys(proxy).length ? proxy : undefined
      })(),
    }
  }
}) 