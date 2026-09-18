import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  const plugins: any[] = [react(), tailwindcss()];

  if (command === 'serve') {
    plugins.push({
      name: 'hydrasync-backend-plugin',
      async configureServer(server: any) {
        const { setupHydrasyncBackend } = await import('./backend/setupBackend.ts');
        setupHydrasyncBackend(server.httpServer, server.middlewares);
        if (server.httpServer) {
          server.httpServer.once('listening', () => {
            setupHydrasyncBackend(server.httpServer, server.middlewares);
          });
        }
      },
    });
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
