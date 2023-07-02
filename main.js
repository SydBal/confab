import { fileURLToPath } from 'url'
import { createServer } from 'vite'
import { Server as SocketServer } from 'socket.io'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * initViteServer
 * Handles running the server which serves users the webpage
 */
const initViteServer = async () => {
  const viteServer = await createServer({
    configFile: 'vite.config.js',
    root: __dirname + '/ui',
    server: {
      port: 1337,
    },
  })

  await viteServer.listen()
  console.log('Vite Server Initialized, view @ http://localhost:1337/')
  //viteServer.printUrls()

  return viteServer
}

/**
 * initSocketServer
 * Handles running the socket server used to communicate in real time with frontend
 */
const initSocketServer = async () => {
  const socketServer = new SocketServer(1338, {
    cors: {
      origin: "http://localhost:1337"
    }
  });

  socketServer.on('connection', (socket) => {
    /**
     * onConnect
     */
    console.log('a user connected');
    
    /**
     * onDisconnect
     */
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    /**
     * onChatMessage
     */
    socket.on('chat message', (msg) => {
      socketServer.emit('chat message', msg);
    });
  });

  console.log('Socket.io Server Initialized')
  return socketServer
}

const main = async () => {
  
  const viteServer = await initViteServer()
  const socketServer = await initSocketServer()

}

main()