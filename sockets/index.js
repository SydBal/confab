import { Server as SocketServer } from 'socket.io'
import { socketPort, uiPort } from '../utils/argv.js'

/**
 * initSocketServer
 * Handles running the socket server used to communicate in real time with frontend
 */
export const initSocketServer = async () => {
  const socketServer = new SocketServer(socketPort, {
    cors: {
      origin: `http://localhost:${uiPort}`
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

  console.log(`Socket.io Server Initialized on port ${socketPort}`)
  return socketServer
}