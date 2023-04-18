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
import { ChannelService } from 'src/channel/channel.service';
import { sendMessageDTO } from 'src/dto/sendmessage.dto';
import { sleep } from '../utils/sleep'
import { User } from './user.entity';
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
  constructor(private userService: UserService, private authService: AuthService, private channelService: ChannelService) {
    const check = async () => {
      while (true) {
        await this.check_matchmaking();
        await sleep(10000);
          }               
      }
      check();
  }

  private clients: Map<string, string> = new Map<string, string>();
  private matchmaking: Array<User> = Array();

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

  getConnectedUsers() {
    var list = [];
    this.clients.forEach((value, key) => {
      list.push(value);
    });
    return list;
  }


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
      await client.on('connection', async (data) => {
        this.logger.log(`Received data from client: ${data.token}`);
        try {
          id = this.authService.getIdFromToken(data.token);
        } catch (error) {
          client.emit('connection_error', "Invalid token");
          client.disconnect();
          return;
        }
        this.clients.set(client.id, id);
        var list = this.getConnectedUsers();
        var sendserver = {
          "connected": list,
          "inGame": []
       }
       var channels;
       var user_chan = await this.userService.getChannels(id);
        if (user_chan != null) {
          user_chan.forEach(element => {
            channels.push(element.id);
          });
        }
        if (channels != null && channels.length < 0)
          client.join(channels);
        this.server.emit('connection_server', sendserver);
      });
    }

    
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');
 
  @SubscribeMessage('friend_request')
  async handleFriendRequest(client: Socket, payload: any) {
    var token = payload.token;
    var friend_id = payload.friend_id;
    var user_id = this.verifyToken(token, client);
    if (user_id == null) {
      var erro = {
        "code": 401
      }
      client.emit('friend_code', erro);
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
      await this.userService.removeFriendRequest(user_id, friend_id);
      if (this.clients[friend_id] != null) {
        var send = {
          "code" : 5,
          "id": user.id
        }
        this.server.sockets[this.clients[friend_id]].emit('friend_request', send);
        await this.userService.addFriend(user_id, friend_id);
        await this.userService.addFriend(friend_id, user_id);
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

  @SubscribeMessage('send_message')
  async handleMessage(client: Socket, payload: any) {
    var token = payload.token;
    var channel_id = payload.channel_id;
    var message = payload.content;
    var send;
    var user_id = this.verifyToken(token, client);
    if (user_id == null) {
      send = {
        "code": 401
      }
      client.emit('message_code', send);
      return;
    }
    var user = await this.userService.getUserById(user_id);
    var channel = await this.channelService.getChannelById(channel_id);
    if (channel == null) {
      send = {
        "code": 1
      }
      client.emit('message_code', send);
      return;
    }
    if (!await this.channelService.isInChannel(user, channel)) {
      send = {
        "code": 2
      }
      client.emit('message_code', send);
      return;
    }
    message = new sendMessageDTO;
    message.content = payload.content;
    message.user = user_id;
    message.channel = channel_id;
    var msg = await this.channelService.sendMessage(message);
    send = {
      "code": 0
    }
    client.emit('message_code', send);
    var sendmsg = {
      "id": msg.id,
      "content": msg.content,
      "user": msg.user.id,
      "channel": msg.channel,
      "date": msg.date
    }
    this.server.to(channel_id).emit('message', sendmsg);
  }

  @SubscribeMessage('join_channel')
  async handleJoinChannel(client: Socket, payload: any) {
    var token = payload.token;
    var channel_id = payload.channel_id;
    var user_id = this.verifyToken(token, client);
    if (user_id == null) {
      var erro = {
        "code": 401
      }
      client.emit('join_code', erro);
      return;
    }
    var user = await this.userService.getUserById(user_id);
    var channel = await this.channelService.getChannelById(channel_id);
    var erro = {
      "code": 0
    }
    if (channel == null) {
      erro = {
        "code": 1
      }
    }
    else if (!await this.channelService.isInChannel(user, channel)) {
       erro = {
        "code": 2
      }
    }
    else
    {
      client.join(channel_id);
      erro = {
        "code": 0
      }
    }
    client.emit('join_code', erro);
    var send = {
      "user_id": user.id,
      "channel_id": channel_id
    }
    this.server.to(channel_id).emit('user_join', send);
  }
  @SubscribeMessage('leave_channel')
  async handleLeaveChannel(client: Socket, payload: any) {
    var token = payload.token;
    var channel_id = payload.channel_id;
    var user_id = this.verifyToken(token, client);
    if (user_id == null) {
      var erro = {
        "code": 401
      }
      client.emit('leave_code', erro);
      return;
    }
    var user = await this.userService.getUserById(user_id);
    var channel = await this.channelService.getChannelById(channel_id);
    var erro = {
      "code": 0
    }
    if (channel == null) {
      erro = {
        "code": 1
      }
    }
    else if (!await this.channelService.isInChannel(user, channel)) {
       erro = {
        "code": 2
      }
    }
    else
    {
      client.leave(channel_id);
      erro = {
        "code": 0
      }
    }
    client.emit('leave_code', erro);
    var send = {
      "user_id": user.id,
      "channel_id": channel_id
    }
    this.server.to(channel_id).emit('user_leave', send);
  }

  //
  //
  //

  @SubscribeMessage('join_matchmaking')
  async join_matchmaking(client: Socket, payload: any)
  {
    var id;
    var user;
    try {
      id = await this.authService.getIdFromToken(payload.token);
      user = await this.userService.getUserById(id);
    } catch (error) {
      await client.emit('connection_error', "Invalid token");
      await client.disconnect();
      return;
    }
    this.matchmaking.push(user);
    await client.emit('message_code', 'ok');
  }

  async check_matchmaking()
  {
    var matchmaking_len = this.matchmaking.length;
    while (matchmaking_len > 1)
    {
      this.matchmaking.forEach(user1 => {
        var authorized_player = this.matchmaking.filter(user2 => { user1.id != user2.id && await this.userService.OneOfTwoBlocked(user1.id, user2.id) == false});
        var len_authorized_player = authorized_player.length;
        if (len_authorized_player > 1){
          var random_player = authorized_player[Math.floor(Math.random() * authorized_player.length)];
          //TODO: create game
        }
      });
      matchmaking_len = this.matchmaking.length;
    }
  }  
}
