import { Server, Socket } from 'socket.io';

export function verifyToken(token: string, client: Socket) {
  try {
    const id = this.authService.getIdFromToken(token);
    return id;
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
  connected: Map<string, string>,
  ingame: Map<string, string>,
  server: Server,
) {
  const connectedlist = getKeys(connected);
  const ingamelist = getKeys(ingame);
  const send = {
    connected: connectedlist,
    ingame: ingamelist,
  };
  console.log(send);
  server.emit('connection_server', send);
}
