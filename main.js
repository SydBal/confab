import { initViteServer } from './ui/vite.js';
import { initSocketServer } from './sockets/index.js';

(async () => {
  const viteServer = await initViteServer()
  const socketServer = await initSocketServer(viteServer.httpServer)
})()