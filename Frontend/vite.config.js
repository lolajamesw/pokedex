import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  configureServer(server) {
    server.httpServer?.once('listening', () => {
      const address = server.httpServer.address()
      const host = address.address === '::' ? 'localhost' : address.address
      const port = address.port
      console.log(`\n👉 Frontend running at: http://${host}:${port}\n`)
    })
  }
})
