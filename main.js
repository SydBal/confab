import { initViteServer } from './ui/index.js';
import { initSocketServer } from './sockets/index.js';

const main = async () => {
  const viteServer = await initViteServer()
  const socketServer = await initSocketServer()
}

main()