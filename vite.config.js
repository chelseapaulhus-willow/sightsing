import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: {
      key: fs.readFileSync('./.cert/dev-key.pem'),
      cert: fs.readFileSync('./.cert/dev-cert.pem'),
    },
    hmr: {
      host: '192.168.1.174',   // same IP as above
      protocol: 'wss',
      port: 5173,
    },
  },
  base: "./",
  build: {
    outDir: "dist",   // <- must match webDir
  },
})
