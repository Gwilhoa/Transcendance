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

  private clients: Map<string, number> = new Map<string, number>();
 
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');
 
  @SubscribeMessage('friendRequest')
  async handleFriendRequest(client: Socket, payload: any) {
    this.logger.log(`Client ${this.clients[client.id]} sent a friend request to ${payload.to}`);
    var receiver = await this.userService.getUserById(payload.to);
    var sender = await this.userService.getUserById(payload.from);
    if (receiver == null || sender == null)
      return;
    receiver.requestsReceived.forEach((request) => {
      if (request.receiver.id == sender.id) {
        this.server.emit('friendRequest', {to: sender.id, message: "alreadySent"});
        return;
      }
    });
    sender.requestsReceived.forEach((request) => {
      if (request.receiver.id == sender.id) {
        this.server.emit('friendRequest', {to: sender.id, message: "you are now friends"});
        this.userService.addFriend(sender.id, receiver.id);
        this.userService.addFriend(receiver.id, sender.id);
      }
    });
    this.server.emit('friendRequest', payload);
  }

  @SubscribeMessage('friendRequestResponse')
  async handleFriendRequestResponse(client: Socket, payload: any) {
    this.logger.log(`Client ${this.clients[client.id]} sent a friend request response to ${payload.to}`);
    var receiver = await this.userService.getUserById(payload.to);
    var sender = await this.userService.getUserById(payload.from);
    if (receiver == null || sender == null)
      return;
    if (payload.response == "accept") {
      this.userService.addFriend(sender.id, receiver.id);
      this.userService.addFriend(receiver.id, sender.id);
    }
    this.server.emit('friendRequestResponse', {to: sender.id, message: payload.response});
  }

  @SubscribeMessage('identify')
  handleIdentify(client: Socket, payload: any): void {
    console.log(`Client ${client.id} has been identified as ${payload.clientId}`);
    this.clients.set(client.id, payload.clientId);
  }
 
  afterInit(server: Server) {
   this.logger.log('Init');
  }
 
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }
 
  handleConnection(client: Socket, ...args: any[]) {
    this.server.emit("test", "{salut : salut}")
   this.logger.log(`Client connected: ${client.id}`);
  }
 }
