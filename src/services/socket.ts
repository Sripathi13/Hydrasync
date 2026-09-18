import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export type ConnectionState = 'connected' | 'reconnecting' | 'disconnected';

export function getSocket(onStateChange?: (state: ConnectionState) => void): Socket {
  if (!socket) {
    socket = io(window.location.origin, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 20,
      reconnectionDelay: 1500,
      timeout: 8000,
    });

    socket.on('connect', () => {
      console.log('[HydraSync Client] WebSocket connected.');
      onStateChange?.('connected');
    });

    socket.on('disconnect', (reason) => {
      console.warn('[HydraSync Client] WebSocket disconnected:', reason);
      onStateChange?.('disconnected');
    });

    socket.on('connect_error', (error) => {
      console.warn('[HydraSync Client] WebSocket error:', error.message);
      onStateChange?.('reconnecting');
    });

    socket.on('reconnect_attempt', () => {
      onStateChange?.('reconnecting');
    });

    socket.on('reconnect', () => {
      console.log('[HydraSync Client] WebSocket reconnected.');
      onStateChange?.('connected');
    });
  }

  return socket;
}
