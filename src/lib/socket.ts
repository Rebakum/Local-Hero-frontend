import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// The Socket.IO server lives on the same origin as the REST API, minus the
// "/api/v1" path prefix.
const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1').replace(
  /\/api\/v1\/?$/,
  ''
);

export const connectSocket = (): Socket => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  socket?.disconnect();
  socket = null;
};
