import { readFileSync } from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const packageVersion: string = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.ZEROFRAME_BACKEND_URL;

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __APP_VERSION__: JSON.stringify(packageVersion),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    build: {
      sourcemap: false,
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      fs: { strict: true },
      proxy: backendUrl
        ? {
            '/api': { target: backendUrl, changeOrigin: true },
            '/ws': { target: backendUrl, changeOrigin: true, ws: true },
          }
        : undefined,
    },
  };
});
