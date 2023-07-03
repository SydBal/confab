import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { uiPort, isDev } from '../utils/argv.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  mode: isDev ? 'development' : 'production',
  root: `${__dirname}/src`,
  server: {
    port: uiPort,
    open: true,
    host: true,
  },
  preview: {
    port: uiPort,
    open: false,
    host: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  }
})
