import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Listen on all network interfaces
    port: 1333,        // Adjust port if necessary
    watch: {
      usePolling: true,  // Optionally enable polling if needed (can be helpful for file watcher issues)
    }
  }
})
