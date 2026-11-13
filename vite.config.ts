import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],

  base: '/geo3d-project-configurator/',
  build: {
    outDir: 'dist',
  },

  test: {
    environment: 'jsdom',
    coverage: {
      include: ['src/**'],
      exclude: ['src/main.tsx'],
    },
  },
});
