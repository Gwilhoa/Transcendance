import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

export function verifyToken(token: string, authService: AuthService) {
  try {
    return authService.getIdFromToken(token);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function getKeys(map: Map<any, any>) {
  const list = [];
  map.forEach((key, value) => {
    list.push(value);
  });
  return list;
}

export function wrongtoken(client: Socket) {
  client.emit('connection_error', 'Invalid token');
  client.disconnect();
}

export function send_connection_server(
  connected: Map<string, Socket>,
  ingame,
  server: Server,
) {
  const connectedlist = getKeys(connected);
  const send = {
    connected: connectedlist,
    ingame: ingame,
  };
  server.emit('connection_server', send);
}

export function getIdFromSocket(
  socket: Socket,
  connected: Map<string, Socket>,
) {
  connected.forEach((value, key) => {
    if (value == socket) {
      return key;
    }
  });
  return null;
}
