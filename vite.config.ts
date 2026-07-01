import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' keeps asset paths relative so the static build deploys anywhere
// (Netlify, Vercel, GitHub Pages, an S3 bucket) without extra config.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
