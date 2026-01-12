import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:9999';

export const socket: Socket = io(URL, {
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  timeout: 10000,
});

const onConnectionCallbacks: Array<() => void> = [];
const onDisconnectionCallbacks: Array<() => void> = [];
const onTotalConnectionsCallbacks: Array<(total: number) => void> = [];

socket.on('connect', () => {
  onConnectionCallbacks.forEach(cb => cb());
});

socket.on('disconnect', () => {
  onDisconnectionCallbacks.forEach(cb => cb());
});

socket.on('total_connections', (data: { total_connections: number }) => {
  onTotalConnectionsCallbacks.forEach(cb => cb(data.total_connections));
})

export function onSocketConnected(cb: () => void) {
  onConnectionCallbacks.push(cb);

  return () => {
    const index = onConnectionCallbacks.indexOf(cb);
    if (index > -1) {
      onConnectionCallbacks.splice(index, 1);
    }
  };
}

export function onSocketDisconnected(cb: () => void) {
  onDisconnectionCallbacks.push(cb);

  return () => {
    const index = onDisconnectionCallbacks.indexOf(cb);
    if (index > -1) {
      onDisconnectionCallbacks.splice(index, 1);
    }
  };
}

export function onTotalConnections(cb: (total: number) => void) {
  onTotalConnectionsCallbacks.push(cb);
  
  return () => {
    const index = onTotalConnectionsCallbacks.indexOf(cb);
    if (index > -1) {
      onTotalConnectionsCallbacks.splice(index, 1);
    }
  };
}

export function joinProtocol(protocolId: string | number) {
  socket.emit('join_protocol', { protocol_id: protocolId });
}

export function leaveProtocol(protocolId: string | number) {
  socket.emit('leave_protocol', { protocol_id: protocolId });
}

export function onProtocolUpdated(cb: (data: { protocol_id: number }) => void) {
  socket.on('protocol_updated', cb);
  
  return () => {
    socket.off('protocol_updated', cb);
  };
}

export function onProtocolUserCount(cb: (data: { protocol_id: number; user_count: number }) => void) {
  socket.on('protocol_user_count', cb);
  
  return () => {
    socket.off('protocol_user_count', cb);
  };
}

export function disconnectSocket() {
  socket.disconnect();
}
