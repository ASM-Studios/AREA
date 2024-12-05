import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 8081,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@Config': path.resolve(__dirname, './src/Config'),
        // ... other aliases
      }
    }
  }
})
