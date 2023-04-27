import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Game } from '../events/Game.class';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { sendMessageDTO } from 'src/dto/sendmessage.dto';
import { sleep } from '../utils/sleep';
import { User } from '../user/user.entity';
import { GameService } from 'src/game/game.service';
import { CreateGameDTO } from 'src/dto/create-game.dto';
import { UserStatus } from 'src/utils/user.enum';
import {
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
  private clients: Map<string, string> = new Map<string, string>();
  private ingame: Map<string, string> = new Map<string, string>();
  private games: Map<string, Game> = new Map<string, Game>();
  private matchmaking: Array<User> = [];
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
    check();
  }

  sendconnected() {
    send_connection_server(this.clients, this.ingame, this.server);
  }

  afterInit(server: Server) {
    this.logger.log('Socket server initialized');
  }

  handleDisconnect(client: Socket) {
    const id = this.clients.get(client.id);
    this.userService.changeStatus(id, UserStatus.OFFLINE);
    this.logger.log(`Client disconnected: ${id}`);
    this.clients.delete(client.id);
    if (this.ingame.has(client.id)) {
      this.ingame.delete(client.id);
    }
    this.sendconnected();
  }

  //on connection
  async handleConnection(client: Socket, ...args: any[]) {
    console.log('[Socket] new client connected');
    let id;
    await client.on('connection', async (data) => {
      try {
        id = this.authService.getIdFromToken(data.token);
      } catch (error) {
        wrongtoken(client);
        return;
      }
      await this.userService.changeStatus(id, UserStatus.CONNECTED);
      this.clients.set(client.id, id);
      this.sendconnected();
      let channels;
      const user_chan = await this.userService.getChannels(id);
      if (user_chan != null) {
        user_chan.forEach((element) => {
          channels.push(element.id);
        });
      }
      if (channels != null && channels.length < 0) client.join(channels);
    }); //le message "connection" doit etre envoyé à la connection du client
  }

  //on friend request
  @SubscribeMessage('friend_request') //reception d'une demande d'ami / accepter une demande d'ami
  async handleFriendRequest(client: Socket, payload: any) {
    let send;
    const token = payload.token;
    const friend_id = payload.friend_id;
    const user_id = verifyToken(token, client);
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
    const user_id = verifyToken(token, client);
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
      const msg = await this.channelService.sendMessage(message, user_id);
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
    const user_id = verifyToken(token, client);
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
    const user_id = verifyToken(token, client);
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
    let id;
    let user;
    try {
      id = await this.authService.getIdFromToken(payload.token);
      user = await this.userService.getUserById(id);
    } catch (error) {
      client.emit('connection_error', 'Invalid token');
      client.disconnect();
      return;
    }
    this.matchmaking.push(user);
    const send = {
      code: 0,
    };
    client.emit('matchmaking_code', send);
  }

  async check_matchmaking() {
    let matchmaking_len = this.matchmaking.length;
    while (matchmaking_len > 1) {
      this.matchmaking.forEach((user1) => async () => {
        const authorized_player = this.matchmaking.filter(
          async (user2) =>
            user2.id !== user1.id &&
            (await this.userService.OneOfTwoBlocked(user1.id, user2.id)) ===
              false,
        );
        const len_authorized_player = authorized_player.length;
        if (len_authorized_player > 1) {
          const random_player =
            authorized_player[
              Math.floor(Math.random() * authorized_player.length)
            ];
          const gameinfo = new CreateGameDTO();
          gameinfo.user1_id = user1.id;
          gameinfo.user2_id = random_player.id;

          const create_game = await this.gameService.createGame(gameinfo);
          //TODO: create game
          await this.userService.changeStatus(user1.id, UserStatus.IN_GAME); // TODO: status in game
          await this.userService.changeStatus(
            random_player.id,
            UserStatus.IN_GAME,
          ); // TODO: status in game
          this.clients[user1.id].join(create_game.id);
          this.clients[random_player.id].join(create_game.id);
          const send = {
            game_id: create_game.id,
          };
          this.server.to(create_game.id).emit('create_game', send);
          this.games.set(
            create_game.id,
            new Game(create_game.id, user1.id, random_player.id, this.server),
          );
        }
      });
      matchmaking_len = this.matchmaking.length;
    }
  }

  @SubscribeMessage('input_game')
  async input_game(client: Socket, payload: any) {
    const game_id = payload.game_id;
    const position = payload.position;
    const user_id = verifyToken(payload.token, client);
    if (position > 100 || position < 0) {
      return;
    }
    this.games[game_id].updateRacket(user_id, position);
    this.server
      .to(game_id)
      .emit('update_game', this.games[game_id].getGameInfo());
  }
}
