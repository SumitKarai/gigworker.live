import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
// Removed unused 'resolve' import

// https://vite.dev/config/
export default defineConfig({
  plugins: [ tailwindcss(), react()],
  build: {
    outDir: 'public', // this sets the build output to public/
    emptyOutDir: true, // clean public before building
  },
})
