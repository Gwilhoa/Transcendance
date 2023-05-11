import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Game } from './Game.class';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { sendMessageDTO } from 'src/dto/sendmessage.dto';
import { sleep } from '../utils/sleep';
import { GameService } from 'src/game/game.service';
import { CreateGameDTO } from 'src/dto/create-game.dto';
import { UserStatus } from 'src/utils/user.enum';
import {
  getIdFromSocket,
  send_connection_server,
  verifyToken,
  wrongtoken,
} from 'src/utils/socket.function';
import { FriendCode, messageCode } from 'src/utils/requestcode.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private clients: Map<string, Socket> = new Map<string, Socket>();
  private ingame: Map<string, string> = new Map<string, string>();
  private games: Map<string, Game> = new Map<string, Game>();
  private matchmaking: Array<Socket> = [];
  private logger: Logger = new Logger('EventsGateway');

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private channelService: ChannelService,
    private gameService: GameService,
  ) {
    const check = async () => {
      while (true) {
        await this.check_matchmaking();
        await sleep(10000);
      }
    };
    check().then(() => this.logger.log('check matchmaking started'));
  }

  sendconnected() {
    send_connection_server(this.clients, this.ingame, this.server);
  }

  afterInit() {
    this.logger.log('Socket server initialized');
  }

  async handleDisconnect(client: Socket) {
    const id = getIdFromSocket(client, this.clients);
    if ((await this.userService.changeStatus(id, UserStatus.OFFLINE)) == null) {
      this.logger.error(`Error changing status of user ${id}`);
      wrongtoken(client);
      this.clients.delete(client.id);
      this.sendconnected();
    }
    this.logger.log(`Client disconnected: ${id}`);
    this.clients.delete(client.id);
    if (this.ingame.has(getIdFromSocket(client, this.clients))) {
      const game = await this.gameService.remakeGame(
        this.ingame.get(client.id),
      );
      this.ingame.delete(game.user1.id);
      this.ingame.delete(game.user2.id);
    }
    this.sendconnected();
  }

  //on connection
  async handleConnection(client: Socket) {
    console.log('[Socket] new client connected');
    let id;
    await client.on('connection', async (data) => {
      try {
        id = this.authService.getIdFromToken(data.token);
      } catch (error) {
        wrongtoken(client);
        return;
      }
      if (
        (await this.userService.changeStatus(id, UserStatus.CONNECTED)) == null
      )
        wrongtoken(client);
      this.clients.set(client.id, id);
      this.sendconnected();
      const channels = await this.channelService.getAccessibleChannels(id);
      for (const channel of channels) {
        client.join(channel.id);
      }
    });
  }

  //on friend request
  @SubscribeMessage('friend_request') //reception d'une demande d'ami / accepter une demande d'ami
  async handleFriendRequest(client: Socket, payload: any) {
    let send;
    const token = payload.token;
    const friend_id = payload.friend_id;
    const user_id = verifyToken(token);
    if (user_id == null) {
      client.emit('friend_code', FriendCode.UNAUTHORIZED);
      return;
    }
    const user = await this.userService.getUserById(user_id);
    const friend = await this.userService.getUserById(friend_id);
    let ret;
    if (friend == null) {
      ret = {
        code: FriendCode.UNEXISTING_USER,
      };
    } else if (this.userService.isfriend(user, friend)) {
      ret = {
        code: FriendCode.ALREADY_FRIEND,
      };
    } else if (this.userService.asfriendrequestby(user, friend)) {
      await this.userService.removeFriendRequest(user_id, friend_id);
      if (this.clients[friend_id] != null) {
        send = {
          code: FriendCode.NEW_FRIEND,
          id: user.id,
        };
        this.server.sockets[this.clients[friend_id]].emit(
          'friend_request',
          send,
        );
        await this.userService.addFriend(user_id, friend_id);
        await this.userService.addFriend(friend_id, user_id);
      }
      ret = {
        code: FriendCode.NEW_FRIEND,
      };
    } else {
      ret = {
        code: FriendCode.SUCCESS,
      };
      await this.userService.addFriendRequest(user_id, friend_id);
      if (this.clients[friend_id] != null) {
        send = {
          code: FriendCode.FRIEND_REQUEST,
          id: user.id,
        };
        this.server.sockets[this.clients[friend_id]].emit(
          'friend_request',
          send,
        );
      }
    }
    client.emit('friend_code', ret);
  }

  //on send message
  @SubscribeMessage('send_message')
  async handleMessage(client: Socket, payload: any) {
    if (
      payload.token == null ||
      payload.channel_id == null ||
      payload.content == null
    ) {
      client.emit('message_code', messageCode.INVALID_FORMAT);
    }
    const token = payload.token;
    const channel_id = payload.channel_id;
    let message = payload.content;
    let send;
    const user_id = verifyToken(token);
    const user = await this.userService.getUserById(user_id);
    const channel = await this.channelService.getChannelById(channel_id);
    if (user == null) {
      send = {
        code: messageCode.UNAUTHORIZED,
      };
    } else if (channel == null) {
      send = {
        code: messageCode.UNEXISTING_CHANNEL,
      };
    } else if (!(await this.channelService.isInChannel(user, channel))) {
      send = {
        code: messageCode.UNACCESSIBLE_CHANNEL,
      };
    } else {
      message = new sendMessageDTO();
      message.content = payload.content;
      message.user = user_id;
      message.channel = channel_id;
      let msg;
      try {
        msg = await this.channelService.sendMessage(message, user_id);
      } catch (error) {
        send = {
          code: messageCode.INVALID_FORMAT,
        };
        client.emit('message_code', send);
        return;
      }
      send = {
        code: messageCode.SUCCESS,
      };
      const sendmsg = {
        id: msg.id,
        content: msg.content,
        user: msg.user.id,
        channel: msg.channel,
        date: msg.date,
      };
      this.server.to(channel_id).emit('message', sendmsg);
    }
    client.emit('message_code', send);
  }

  @SubscribeMessage('join_channel')
  async handleJoinChannel(client: Socket, payload: any) {
    let send;
    const token = payload.token;
    const channel_id = payload.channel_id;
    const user_id = verifyToken(token);
    if (user_id == null) {
      send = {
        code: 401,
      };
      client.emit('join_code', send);
      return;
    }
    const user = await this.userService.getUserById(user_id);
    const channel = await this.channelService.getChannelById(channel_id);
    send = {
      code: 0,
    };
    if (channel == null) {
      send = {
        code: 1,
      };
    } else if (!(await this.channelService.isInChannel(user, channel))) {
      send = {
        code: 2,
      };
    } else {
      client.join(channel_id);
      send = {
        code: 0,
      };
    }
    client.emit('join_code', send);
    send = {
      user_id: user.id,
      channel_id: channel_id,
    };
    this.server.to(channel_id).emit('user_join', send);
  }

  @SubscribeMessage('leave_channel')
  async handleLeaveChannel(client: Socket, payload: any) {
    let send;
    const token = payload.token;
    const channel_id = payload.channel_id;
    const user_id = verifyToken(token);
    if (user_id == null) {
      send = {
        code: 401,
      };
      client.emit('leave_code', send);
      return;
    }
    const user = await this.userService.getUserById(user_id);
    const channel = await this.channelService.getChannelById(channel_id);
    send = {
      code: 0,
    };
    if (channel == null) {
      send = {
        code: 1,
      };
    } else if (!(await this.channelService.isInChannel(user, channel))) {
      send = {
        code: 2,
      };
    } else {
      client.leave(channel_id);
      send = {
        code: 0,
      };
    }
    client.emit('leave_code', send);
    send = {
      user_id: user.id,
      channel_id: channel_id,
    };
    this.server.to(channel_id).emit('user_leave', send);
  }

  @SubscribeMessage('join_matchmaking')
  async join_matchmaking(client: Socket, payload: any) {
    try {
      await this.authService.getIdFromToken(payload.token);
    } catch (error) {
      client.emit('connection_error', 'Invalid token');
      client.disconnect();
      return;
    }
    this.matchmaking.push(client);
    const send = {
      code: 0,
    };
    client.emit('matchmaking_code', send);
  }

  async check_matchmaking() {
    this.matchmaking.forEach((player) => async () => {
      const authorized_player = this.matchmaking.filter(
        async (pretended_player) =>
          player.id !== pretended_player.id &&
          (await this.userService.OneOfTwoBlocked(
            getIdFromSocket(player, this.clients),
            getIdFromSocket(pretended_player, this.clients),
          )),
      );
      if (authorized_player.length > 0) {
        const rival =
          authorized_player[
            Math.floor(Math.random() * authorized_player.length)
          ];
        const create_gameDTO = new CreateGameDTO();
        create_gameDTO.user1_id = getIdFromSocket(player, this.clients);
        create_gameDTO.user2_id = getIdFromSocket(rival, this.clients);
        await this.userService.changeStatus(
          create_gameDTO.user1_id,
          UserStatus.IN_GAME,
        );
        await this.userService.changeStatus(
          create_gameDTO.user2_id,
          UserStatus.IN_GAME,
        );
        this.sendconnected();
        const create_game = await this.gameService.createGame(create_gameDTO);
        this.ingame.set(create_gameDTO.user1_id, create_game.id);
        this.ingame.set(create_gameDTO.user2_id, create_game.id);
        player.emit('game_found', {
          game_id: create_game.id,
          user: 1,
          rival: rival.id,
        });
        rival.emit('game_found', {
          game_id: create_game.id,
          user: 2,
          rival: player.id,
        });
        player.join(create_game.id);
        rival.join(create_game.id);
        const game = new Game(
          create_game.id,
          player,
          rival,
          this.server,
          this.gameService,
        );
        game.onFinish((game) => {
          this.ingame.delete(getIdFromSocket(game.getUser1(), this.clients));
          this.ingame.delete(getIdFromSocket(game.getUser2(), this.clients));
          this.sendconnected();
          this.logger.log(game.getId() + ' finished');
        });
        this.logger.log(game.getId() + ' started');
        game.start();
      }
    });
  }

  @SubscribeMessage('input_game')
  async input_game(client: Socket, payload: any) {
    const game_id = payload.game_id;
    const position = payload.position;
    if (position > 100 || position < 0) {
      return;
    }
    this.games[game_id].updateRacket(client, position);
    this.server
      .to(game_id)
      .emit('update_game', this.games[game_id].getGameInfo());
  }
}
