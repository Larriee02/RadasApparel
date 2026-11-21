import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createRequestApi } from './server/requests.js'

const requestApi = {
  name: 'radas-request-api',
  configureServer(server) {
    server.middlewares.use(createRequestApi())
  },
  configurePreviewServer(server) {
    server.middlewares.use(createRequestApi())
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss(), requestApi],
})
