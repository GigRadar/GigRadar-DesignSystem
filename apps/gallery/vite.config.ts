import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point at source, so gallery hot-reloads on token and component edits
      // without a build step in between.
      '@gigradar/theme': resolve(__dirname, '../../packages/theme/src/index.ts'),
      '@gigradar/ui': resolve(__dirname, '../../packages/ui/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
