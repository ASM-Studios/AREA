import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const port = parseInt(env.VITE_PORT) || 8081

  return {
    plugins: [
      react(),
      {
        name: 'serve-apk',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/client.apk') {
              try {
                const apkPath = path.resolve(__dirname, 'public/client.apk');
                if (fs.existsSync(apkPath)) {
                  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
                  res.setHeader('Content-Disposition', 'attachment; filename="client.apk"');
                  return res.end(fs.readFileSync(apkPath));
                } else {
                  res.statusCode = 404;
                  return res.end();
                }
              } catch (error) {
                console.error('APK serving error:', error);
                res.statusCode = 500;
                return res.end();
              }
            }
            next();
          });
        }
      }
    ],
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
