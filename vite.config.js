import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Add this line to use relative paths
  plugins: [react()],
  assetsInclude: ['**/*.glb'] // Include .glb files
})
