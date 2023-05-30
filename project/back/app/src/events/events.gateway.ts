import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {Game} from './Game.class';
import {Logger} from '@nestjs/common';
import {Server, Socket} from 'socket.io';
import {UserService} from 'src/user/user.service';
import {AuthService} from 'src/auth/auth.service';
import {ChannelService} from 'src/channel/channel.service';
import {sendMessageDTO} from 'src/dto/sendmessage.dto';
import {GameService} from 'src/game/game.service';
import {CreateGameDTO} from 'src/dto/create-game.dto';
import {UserStatus} from 'src/utils/user.enum';
import {getIdFromSocket, getKeys, send_connection_server, verifyToken, wrongtoken,} from 'src/utils/socket.function';
import {FriendCode, messageCode} from 'src/utils/requestcode.enum';

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
  ) {}
  sendconnected() {
    send_connection_server(this.clients, this.ingame, this.server);
  }

  afterInit() {
    this.logger.log('Socket server initialized');
  }

  async handleDisconnect(client: Socket) {
    const id = getIdFromSocket(client, this.clients);
    if (id == null) {
      client.disconnect();
      return;
    }
    this.logger.log(`Client disconnected: ${id}`);
    if ((await this.userService.changeStatus(id, UserStatus.OFFLINE)) == null) {
      wrongtoken(client);
      this.clients.delete(id);
      this.sendconnected();
    }
    this.clients.delete(id);
    if (getKeys(this.ingame).includes(id)) {
      const game = await this.gameService.remakeGame(
        this.ingame.get(client.id),
      );
      if (game == null) {
        this.logger.error('game not found');
        return;
      }
      this.ingame.delete(game.user1.id);
      this.ingame.delete(game.user2.id);
    }
    if (this.matchmaking.includes(client)) {
      this.matchmaking.splice(this.matchmaking.indexOf(client), 1);
    }
    this.sendconnected();
  }

  //on connection
  async handleConnection(client: Socket) {
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
      ) {
        wrongtoken(client);
        return;
      }
      this.clients.set(id, client);
      this.sendconnected();
      let channels = null;
      try {
        channels = await this.channelService.getAccessibleChannels(id);
      } catch (error) {
        wrongtoken(client);
        return;
      }
      if (channels == null) {
        wrongtoken(client);
        return;
      }
      this.logger.debug(channels);
      for (const channel of channels) {
        client.join(channel.id);
      }
      this.logger.log(`Client connected: ${id}`);
    });
  }

  //on friend request
  @SubscribeMessage('friend_request') //reception d'une demande d'ami / accepter une demande d'ami
  async handleFriendRequest(client: Socket, payload: any) {
    let send;
    const token = payload.token;
    const friend_id = payload.friend_id;
    let user_id = null;
    try {
      user_id = verifyToken(token, this.authService);
    } catch (error) {
      wrongtoken(client);
      return;
    }
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
    const user_id = getIdFromSocket(client, this.clients);
    try {
      verifyToken(token, this.authService);
    } catch (error) {
      wrongtoken(client);
      return;
    }
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
    } else if (!(await this.channelService.isInChannel(user.id, channel.id))) {
      send = {
        code: messageCode.UNACCESSIBLE_CHANNEL,
      };
    } else {
      message = new sendMessageDTO();
      message.content = payload.content;
      message.channel_id = payload.channel_id;
      let msg;
      try {
        msg = await this.channelService.sendMessage(message, user.id);
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
        username: msg.user.username,
        channel: msg.channel,
        date: msg.date,
      };
      this.server.to(channel.id).emit('message', sendmsg);
      //this.server.emit('message', sendmsg);
    }
    client.emit('message_code', send);
  }

  @SubscribeMessage('join_channel')
  async handleJoinChannel(client: Socket, payload: any) {
    let send;
    const token = payload.token;
    const channel_id = payload.channel_id;
    const user_id = verifyToken(token, this.authService);
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
    } else if (!(await this.channelService.isInChannel(user.id, channel.id))) {
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
    const user_id = getIdFromSocket(client, this.clients);
    try {
      verifyToken(token, this.authService);
    } catch (error) {
      wrongtoken(client);
      return;
    }
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
    } else if (!(await this.channelService.isInChannel(user.id, channel.id))) {
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
    if (payload.token == null) {
      wrongtoken(client);
      return;
    }
    const id = await this.authService.getIdFromToken(payload.token);
    if (id == null) {
      wrongtoken(client);
      return;
    }
    const user = await this.userService.getUserById(id);
    if (user == null || user.status != UserStatus.CONNECTED) {
      wrongtoken(client);
      return;
    }
    if (getKeys(this.ingame).includes(id)) {
      const send = {
        code: 1,
        message: 'You are already in a game',
      };
      client.emit('matchmaking_code', send);
      return;
    }
    let i = 0;
    while (i < this.matchmaking.length) {
      const player = this.matchmaking[i];
      if (player.id == client.id) {
        const send = {
          code: 1,
          message: 'You are already in matchmaking',
        };
        client.emit('matchmaking_code', send);
        return;
      }
      i++;
    }
    this.logger.debug('new in matchmaking ' + id);
    this.matchmaking.push(client);
    const send = {
      code: 0,
    };
    client.emit('matchmaking_code', send);
    this.check_matchmaking();
  }

  async check_matchmaking() {
    this.logger.debug('checking matchmaking');
    let i = 0;
    while (i < this.matchmaking.length) {
      this.logger.debug(this.matchmaking[i].id);
      const player = this.matchmaking[i];
      const authorized_player = [];
      let j = 0;
      while (j < this.matchmaking.length) {
        const pretended_player = this.matchmaking[j];
        const player_id = getIdFromSocket(player, this.clients);
        const pretended_player_id = getIdFromSocket(
          pretended_player,
          this.clients,
        );
        if (
          pretended_player_id != player_id &&
          !(await this.userService.OneOfTwoBlocked(
            pretended_player_id,
            player_id,
          ))
        ) {
          authorized_player.push(pretended_player);
        }
        j++;
      }
      if (authorized_player.length > 0) {
        const rival =
          authorized_player[
            Math.floor(Math.random() * authorized_player.length)
          ];
        this.logger.debug('found rival ' + rival.id);
        if (this.server.sockets.sockets.get(player.id) == null) {
          const tempmatchmaking = [];
          for (const p of this.matchmaking) {
            if (p.id != player.id) {
              tempmatchmaking.push(p);
            }
          }
          this.matchmaking = tempmatchmaking;
          this.check_matchmaking();
          return;
        }
        if (this.server.sockets.sockets.get(rival.id) == null) {
          const tempmatchmaking = [];
          for (const p of this.matchmaking) {
            if (p.id != rival.id) {
              tempmatchmaking.push(p);
            }
          }
          this.matchmaking = tempmatchmaking;
          this.check_matchmaking();
          return;
        }
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
        this.games[game.getId()] = game;
        game.onFinish((finishedGame) => {
          this.logger.debug(game);
          this.ingame.delete(getIdFromSocket(game.getUser1(), this.clients));
          this.ingame.delete(getIdFromSocket(game.getUser2(), this.clients));
          this.sendconnected();
          this.logger.log(game.getId() + ' finished');
        });
        const tempmatchmaking = [];
        for (const t of this.matchmaking) {
          if (t.id != rival.id && player.id != t.id) {
            tempmatchmaking.push(player);
          }
        }
        this.matchmaking = tempmatchmaking;
        this.server.to(game.getId()).emit('game_start', game.getId());
        this.logger.log('game ' + game.getId() + ' started');
        game.start();
      }
      i++;
    }
  }

  @SubscribeMessage('input_game')
  async input_game(client: Socket, payload: any) {
    const game_id = payload.game_id;
    const type = payload.type;
    this.logger.debug('game id = ' + game_id + ' ' + type);
    this.games[game_id].updateRacket(client, type);
    this.logger.debug(this.games[game_id].getGameInfo());
    this.server
      .to(game_id)
      .emit('update_game', this.games[game_id].getGameInfo());
  }

  async sendchangename(id: string, name: string) {
    this.server.emit('change_name', { id: id, name: name });
  }

  @SubscribeMessage('leave_matchmaking')
  async leave_matchmaking(client: Socket, payload: any) {
    const id = getIdFromSocket(client, this.clients);
    const tempmatchmaking = [];
    let send = {
      code: 1,
    };
    for (const t of this.matchmaking) {
      if (t.id != id) {
        tempmatchmaking.push(t);
        send = {
          code: 0,
        };
      }
    }
    this.matchmaking = tempmatchmaking;
    this.logger.debug('leaving matchmaking ' + id);
    client.emit('matchmaking_code', send);
  }
}
