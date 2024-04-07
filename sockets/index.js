import { Server as SocketServer } from 'socket.io'
import { socketPort } from '../utils/argv.js'

/**
 * initSocketServer
 * Handles running the socket server used to communicate in real time with frontend
 */
export const initSocketServer = async (viteServer) => {
  const socketServer = new SocketServer(viteServer);

  /**
   * Google Cloud Run uses this for scaling
   */
  const {createAdapter} = require('@socket.io/redis-adapter');
  // Replace in-memory adapter with Redis
  const subClient = redisClient.duplicate();
  io.adapter(createAdapter(redisClient, subClient));
  // Add error handlers
  redisClient.on('error', err => {
    console.error(err.message);
  });

  subClient.on('error', err => {
    console.error(err.message);
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

  // Add listener for "updateSocketId" event
  // socket.on('updateSocketId', async ({user, room}) => {
  //   try {
  //     addUser(socket.id, user, room);
  //     socket.join(room);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // });

  console.log(`Socket.io Server Initialized on port ${socketPort}`)
  return socketServer
}