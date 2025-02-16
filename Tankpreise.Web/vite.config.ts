import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
      {
        name: 'generate-config',
        closeBundle() {
          // Generiere config.js mit den Umgebungsvariablen
          const configContent = `window.TANKPREISE_CONFIG = {
    API_BASE_URL: '${env.VITE_API_BASE_URL}',
    DB_CONNECTION: '${env.VITE_DB_CONNECTION}'
};`
          writeFileSync(resolve(__dirname, 'dist/config.js'), configContent)

          // Kopiere update-config.sh in den dist-Ordner
          copyFileSync(
            resolve(__dirname, 'update-config.sh'),
            resolve(__dirname, 'dist/update-config.sh')
          )
          // Mache das Skript ausführbar
          if (process.platform !== 'win32') {
            const { chmodSync } = require('fs')
            chmodSync(resolve(__dirname, 'dist/update-config.sh'), '755')
          }
        }
      }
    ],
    server: {
      port: 5502
    }
  }
}) 