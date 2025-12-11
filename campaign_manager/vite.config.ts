import { defineConfig } from 'vite';

const proxyTarget = process.env.VITE_DEV_SERVER_PROXY ?? 'http://localhost:3000';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
