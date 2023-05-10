import { Server, Socket } from 'socket.io';

export function verifyToken(token: string) {
  try {
    return this.authService.getIdFromToken(token);
  } catch (error) {
    return null;
  }
}

export function getKeys(map: Map<any, any>) {
  const list = [];
  map.forEach((key, value) => {
    list.push(key);
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
  console.log(send);
  server.emit('connection_server', send);
}

export function getIdFromSocket(
  socket: Socket,
  connected: Map<string, Socket>,
) {
  let id = null;
  connected.forEach((value, key) => {
    if (value == socket) {
      id = key;
    }
  });
  return id;
}
