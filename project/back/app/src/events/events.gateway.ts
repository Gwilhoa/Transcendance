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



  private clients: Map<string, string> = new Map<string, string>();

  afterInit(server: Server) {
    this.logger.log('Init');
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
       id = this.authService.getIdFromToken(data.token);
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
     client.emit('connection_client', sendclient)
    }


  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');
 
  @SubscribeMessage('friendRequest')
  async handleFriendRequest(client: Socket, payload: any) {
  }

}

