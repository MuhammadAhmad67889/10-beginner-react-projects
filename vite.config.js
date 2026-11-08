import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The base path matters for GitHub Pages: the site will live at
// muhammadahmad67889.github.io/10-beginner-react-projects/
export default defineConfig({
  plugins: [react()],
  base: '/10-beginner-react-projects/',
})
