import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
    },
  }
})
