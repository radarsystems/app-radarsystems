import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({

  /*
  server: {
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem',
    }
  },*/
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 5 * 1024 * 1024, // Establece el límite en 5 MB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  }
})

