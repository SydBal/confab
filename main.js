import { initViteServer } from './ui/vite.js';
import { initSocketServer } from './sockets/index.js';

const main = async () => {
  const viteServer = await initViteServer()
  const socketServer = await initSocketServer()
}

main()