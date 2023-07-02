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

  /**
   * ChatMemory
   */
  const recentMessages = []
  const messagesToRememberAmount = 10

  const rememberMessage = (newMessage) => {
    recentMessages.push(newMessage)
    if (recentMessages.length < messagesToRememberAmount) return
    recentMessages.shift()
  }

  socketServer.on('connection', (socket) => {
    /**
     * onConnect
     */
    console.log('User connected', socket.id);
    socketServer.to(socket.id).emit('message memory', recentMessages)

    socket.conn.once("upgrade", () => {
      // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
      console.log("Upgraded transport", socket.id, socket.conn.transport.name); // prints "websocket"
    });

    /**
     * onDisconnect
     */
    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });

    /**
     * onChatMessage
     */
    socket.on('chat message', (message) => {
      const nickname = socket.data.nickname || socket.id
      const messageData = { nickname, message }
      socketServer.emit('chat message', messageData)
      rememberMessage(messageData)
    })

    /**
     * onNicknameUpdate
     */
    socket.on('nickname update', (nickname) => {
      const oldNickname = socket.data.nickname || socket.id
      socket.data.nickname = nickname
      console.log(`nickname updated, ${oldNickname} changed to ${socket.data.nickname}`);
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