import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
 } from '@nestjs/websockets';
 import { Logger } from '@nestjs/common';
 import { Socket, Server } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { GetUser } from 'src/auth/decorator/auth.decorator';
import { AuthService } from 'src/auth/auth.service';
import { identity } from 'rxjs';
export enum Status {
  CONNECTED = 0,
  DISCONNECTED = 1,
  IN_GAME = 2,
}
 @WebSocketGateway({
   cors: {
     origin: '*',
   },
 })

 
 export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private userService: UserService, private authService: AuthService) {
    this.clients.set("1", "test");
  }

  verifyToken(token: string, client: Socket) {
    try {
      var id = this.authService.getIdFromToken(token);
      return id;
    }
    catch (error) {
      client.emit('connection_error', "Invalid token");
      return null;
    }
  }

  private clients: Map<string, string> = new Map<string, string>();

  afterInit(server: Server) {
    this.logger.log('Socket server initialized');
   }
  
   handleDisconnect(client: Socket) {
     this.logger.log(`Client disconnected: ${client.id}`);
     this.clients.delete(client.id);
   }
  
    async handleConnection(client: Socket, ...args: any[]) {
      this.logger.log(`Client connected: ${client.id}`);
      var id;
      client.on('connection', (data) => {
        this.logger.log(`Received data from client: ${data.token}`);
        try {
          id = this.authService.getIdFromToken(data.token);
        } catch (error) {
          client.emit('connection_error', "Invalid token");
          client.disconnect();
          return;
        }
        this.clients.set(client.id, id);
        var sendserver = {
          "connected" : id,
        }
        this.server.emit('connection_server', sendserver);
      });
      var list = [];
      this.clients.forEach((value, key) => {
        list.push(value);
      });
     var sendclient = {
        "connected": list,
        "inGame": []
     }
     console.log(id);
     client.emit('connection_client', sendclient);
    }

    
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');
 
  @SubscribeMessage('friend_request')
  async handleFriendRequest(client: Socket, payload: any) {
    var token = payload.token;
    var friend_id = payload.friend_id;
    var user_id = this.verifyToken(token, client);
    if (user_id == null) {
      client.disconnect();
      return;
    }
    var user = await this.userService.getUserById(user_id);
    var friend = await this.userService.getUserById(friend_id);
    var ret;
    if (friend == null) {
      ret = {
        "code": 1
      }
      client.emit('friend_code', ret);
    }
    else if (this.userService.isfriend(user, friend))
    {
      ret = {
        "code": 3
      }
    }
    else if (this.userService.asfriendrequestby(user, friend))
    {
      // il faut supprimer la demande d'ami
      if (this.clients[friend_id] != null) {
        var send = {
          "code" : 5,
          "id": user.id
        }
        this.server.sockets[this.clients[friend_id]].emit('friend_request', send);
      }
      ret = {
        "code": 2
      }
    }
    else {
      ret = {
        "code": 0
      }
      await this.userService.addFriendRequest(user_id, friend_id);
      if (this.clients[friend_id] != null) {
        var send = {
          "code" : 4,
          "id": user.id
        }
        this.server.sockets[this.clients[friend_id]].emit('friend_request', send);
      }
    }
    client.emit('friend_code', ret);
  }

}

