import { Socket, Server } from 'socket.io';

export function verifyToken(token: string, client: Socket) {
    try {
      var id = this.authService.getIdFromToken(token);
      return id;
    }
    catch (error) {
      return null;
    }
  }

export function getKeys(map: Map<any, any>) 
{
    var list = [];
    map.forEach((key, value) => {
        list.push(key);
    });
    return list;
}

export function wrongtoken(client: Socket) {
    client.emit('connection_error', "Invalid token");
    client.disconnect();
}


export function send_connection_server(connected: Map<string, string>, ingame: Map<string, string>, server: Server)
{
  var connectedlist = getKeys(connected);
  var ingamelist = getKeys(ingame);
  var send = {
    "connected": connectedlist,
    "ingame": ingamelist
  }
  console.log(send);
  server.emit('connection_server', send);
}