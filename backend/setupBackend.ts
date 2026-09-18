import express from 'express';
import type { Server as HttpServer } from 'http';
import { apiRouter } from './routes/api.ts';
import { setupSocketIO } from './websocket/socketHandler.ts';

let isApiMounted = false;
let isSocketMounted = false;

export function setupHydrasyncBackend(httpServer?: HttpServer | null, connectApp?: any) {
  // Mount REST API into Connect / Vite middlewares
  if (!isApiMounted && connectApp) {
    isApiMounted = true;
    console.log('[HydraSync Backend] Mounting REST API onto server middlewares...');
    const app = express();
    app.use(express.json());
    app.use(apiRouter);

    connectApp.use('/api', (req: any, res: any, next: any) => {
      app(req, res, next);
    });
  }

  // If httpServer is available, attach Socket.IO
  if (!isSocketMounted && httpServer) {
    isSocketMounted = true;
    setupSocketIO(httpServer);
    console.log('[HydraSync Backend] Socket.IO real-time engine attached.');
  }
}
