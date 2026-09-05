import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Hostinger shared hosting: build to /dist, deploy contents into public_html.
// base '/' (not './'): this is a React Router SPA with two-level routes such
// as /projets/le-sentier. Relative asset URLs resolve against the current
// path, so on those routes the browser asked for /projets/assets/... and
// /projets/media/... and got 404s. Absolute paths pin every asset to the
// domain root, which is where .htaccess (RewriteBase /) serves the site.
// Deploying into a subfolder would require changing this to that subfolder.
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
