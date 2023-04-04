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
  constructor(private userService: UserService) {}



  private clients: Map<string, string> = new Map<string, string>();

  afterInit(server: Server) {
    this.logger.log('Init');
   }
  
   handleDisconnect(client: Socket) {
     this.logger.log(`Client disconnected: ${client.id}`);
     this.clients.delete(client.id);
   }
 
   getUseridByToken(@GetUser('sub') id: string) {
     return id;
   }
  
   async handleConnection(client: Socket, ...args: any[]) {
     this.logger.log(`Client connected: ${client.id}`);
     
     client.on('connection', (data) => {
       this.logger.log(`Received data from client: ${data}`);
       console.log(data.token);
       var ret = this.getUseridByToken(data.token);
       this.clients.set(ret, client.id);
     });
    }
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');
 
  @SubscribeMessage('friendRequest')
  async handleFriendRequest(client: Socket, payload: any) {
  }

  @SubscribeMessage('identify')
  handleIdentify(client: Socket, payload: any): void {
    
  }
}

