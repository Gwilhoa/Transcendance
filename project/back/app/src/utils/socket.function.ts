import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.entity';

export function verifyToken(token: string, authService: AuthService) {
  try {
    return authService.getIdFromToken(token);
  } catch (error) {
    throw Error('Invalid token');
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
}

export function send_connection_server(
  connected: string[],
  ingame: Map<string, string>,
  server: Server,
) {
  const ingamelist = getKeys(ingame);
  const send = {
    connected: connected,
    ingame: ingamelist,
  };
  server.emit('connection_server', send);
}

export function getIdFromSocket(
  socket: Socket,
  connected: Map<string, Socket>,
) {
  let ret = null;
  connected.forEach((value, key) => {
    if (value.id == socket.id) {
      ret = key;
    }
  });
  return ret;
}

export function getSocketFromId(id: string, connected: Socket[]): Socket {
  let ret = null;
  for (const socket of connected) {
    if (socket.data.id == id) {
      ret = socket;
    }
  }
  return ret;
}

export function includeUser(user: User, list: User[]) {
  let ret = false;
  list.forEach((value) => {
    if (value.id == user.id) {
      ret = true;
    }
  });
  return ret;
}

export function disconnect(id: any, clients: string[]): string[] {
  const ret: string[] = [];
  for (const c_id of clients) {
    if (c_id != id) {
      ret.push(c_id);
    }
  }
  return ret;
}

export function getSockets(server: Server): Socket[] {
  const ret: Socket[] = [];
  server.sockets.sockets.forEach((value) => {
    ret.push(value);
  });
  return ret;
}
