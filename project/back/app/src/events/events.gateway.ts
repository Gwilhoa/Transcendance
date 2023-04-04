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
  constructor(private userService: UserService, private authService: AuthService) {}



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
     client.on('connection', (data) => {
       this.logger.log(`Received data from client: ${data.token}`);
       console.log(data.token);
       var id = this.authService.getIdFromToken(data.token);
       console.log(id);
       this.clients.set(client.id, id);
     });
     var sendclient = {
        "connected": this.clients.keys(),
        "inGame": []
     }
     var sendserver = {
        "connected" : identity
     }
     client.emit('connection', sendclient)
     this.server.emit('connection', sendserver);
    }
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');
 
  @SubscribeMessage('friendRequest')
  async handleFriendRequest(client: Socket, payload: any) {
  }

}

