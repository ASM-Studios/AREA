import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const port = parseInt(env.VITE_PORT) || 8081

  return {
    plugins: [react()],
    server: {
      port: port,
      watch: {
        usePolling: true,
      },
      host: true,
      https: {
        key: fs.readFileSync('localhost-key.pem'),
        cert: fs.readFileSync('localhost.pem'),
      },
      strictPort: true,
      listen: {
        port: port,
        host: true,
      }
    },
    optimizeDeps: {
      include: ['cobe'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@Config': path.resolve(__dirname, './src/Config'),
      }
    }
  }
})
