import { Server as SocketIOServer } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { simulationEngine } from '../services/simulationEngine.ts';

export function setupSocketIO(server: HttpServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
    path: '/socket.io/',
    transports: ['websocket', 'polling'],
  });

  // Wire up simulationEngine broadcaster to Socket.IO
  simulationEngine.setBroadcaster((event: string, payload: any) => {
    io.emit(event, payload);
  });

  io.on('connection', (socket) => {
    console.log(`[HydraSync Socket] Client connected: ${socket.id}`);

    // Send initial snapshot immediately upon connection
    const current = simulationEngine.getCurrentTelemetry();
    socket.emit('water:update', {
      reading: current.currentReading,
      anomaly: current.anomaly,
      sections: current.sections,
    });
    socket.emit('sensor:update', simulationEngine.getSensors());
    socket.emit('system:status', {
      health: current.systemHealth,
      timestamp: current.lastUpdated,
      activeAlertsCount: simulationEngine.getAlerts().filter((a) => a.status === 'active').length,
    });

    socket.on('disconnect', (reason) => {
      console.log(`[HydraSync Socket] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}
