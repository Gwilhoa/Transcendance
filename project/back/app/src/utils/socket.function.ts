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
  connected: Map<string, Socket>,
  ingame: Map<string, string>,
  server: Server,
) {
  const connectedlist = getKeys(connected);
  const ingamelist = getKeys(ingame);
  const send = {
    connected: connectedlist,
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

export function getSocketFromId(id: string, connected: Map<string, Socket>) {
  let ret = null;
  connected.forEach((value, key) => {
    if (key == id) {
      ret = value;
    }
  });
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
