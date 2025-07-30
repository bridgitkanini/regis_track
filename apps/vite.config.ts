/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../node_modules/.vite/apps',
  server: {
    port: 4201,
    host: 'localhost',
    open: true
  },
  preview: {
    port: 4201,
    host: 'localhost',
  },
  plugins: [
    !process.env.VITEST && reactRouter(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../dist/apps',
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      input: 'src/root.tsx',
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
