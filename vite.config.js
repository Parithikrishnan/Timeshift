// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or vue or other plugins

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from external devices
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.serveo.net',            // Wildcard subdomains
    ]
  }
})
