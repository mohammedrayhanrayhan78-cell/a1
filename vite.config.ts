import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base './' keeps every asset path relative, so the build works from
// https://<user>.github.io/a1/ without hard-coding the repository name.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist', sourcemap: false },
});
