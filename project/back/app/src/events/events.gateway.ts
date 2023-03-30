import { Bind } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  afterInit(server: any) {}
  
  handleConnection(client: any, ...args: any[]) {
    client.id = '92000';
    console.log('client connected', client.id);
  }
  
  handleDisconnect(client: any) {}

  @Bind(MessageBody('invitation'))
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: any, @ConnectedSocket() client: any) {
    console.log('test');
    return { event: 'invitation', data };
  }
}
