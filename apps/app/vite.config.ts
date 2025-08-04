import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Load only Vite prefixed environment variables
  const env = loadEnv(mode, process.cwd());

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/app',
    server: {
      port: 4200,
      host: 'localhost',
      fs: {
        // Allow serving files from one level up from the package root
        allow: [
          '..',
          '../../node_modules',
          '../../node_modules/@fontsource/ibm-plex-sans/files',
        ],
      },
    },
    define: {
      'import.meta.env.NODE_ENV': JSON.stringify(mode),
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.platform': JSON.stringify('browser'),
      ...Object.entries(env).reduce((acc, [key, val]) => {
        // Only include Vite prefixed env vars
        if (key.startsWith('VITE_')) {
          acc[`import.meta.env.${key}`] = JSON.stringify(val);
        }
        return acc;
      }, {} as Record<string, any>),
    },
    plugins: [react()],
    build: {
      outDir: '../../dist/apps/app',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    resolve: {
      alias: {
        // Add any necessary aliases here
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
  };
});
