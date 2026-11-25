// vite.config.js – minimal Vite configuration for the FIX‑PLUG static site
import { defineConfig } from 'vite';

export default defineConfig({
  // The project currently uses plain HTML files in the root.
  // Vite will treat the root directory as the source and output to `dist`.
  root: '.',
  // Ensure assets (images, SVGs, etc.) are copied as‑is.
  publicDir: 'assets',
  // Base URL for built files – relative so the site can be hosted on any path.
  base: './',
  // No special build transforms needed; we just want Vite to bundle JS/CSS if any.
  build: {
    outDir: 'dist',
    assetsDir: '',
    rollupOptions: {
      input: {
        // Include the main entry points. Vite will pick up all .html files.
        main: './index.html',
        about: './about/index.html',
        artisans: './artisans/index.html',
        customers: './customers/index.html',
        contact: './contact/index.html',
        privacy: './privacy/index.html',
        trust: './trust/index.html'
      }
    }
  }
});
