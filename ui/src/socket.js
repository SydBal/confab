import { io } from 'socket.io-client';

/**
 * Get base URL and strip port if exists before generating socketio url
 */
let uiOriginURL = new URL(window.location.origin);
let urlWithoutPort
if (uiOriginURL.port) {
  urlWithoutPort = uiOriginURL.origin.split(':').slice(0, -1).join(':')
}

const socketURL = `${urlWithoutPort || window.location.origin}:${import.meta.env.VITE_SOCKET_PORT}`;

export const socket = io(socketURL, {
  autoConnect: false
});