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
import { GameService } from 'src/game/game.service';
import { CreateGameDTO } from 'src/dto/create-game.dto';
import { UserStatus } from 'src/utils/user.enum';
import {
  getIdFromSocket,
  getKeys,
  getSocketFromId,
  send_connection_server,
  verifyToken,
  wrongtoken,
} from 'src/utils/socket.function';
import {
  ChannelCode,
  FriendCode,
  messageCode,
} from 'src/utils/requestcode.enum';
import { sleep } from '../utils/sleep';

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
  private rematch: Map<string, boolean> = new Map<string, boolean>();
  private matchmaking: Array<Socket> = [];
  private logger: Logger = new Logger('EventsGateway');
  private dual: Map<string, string> = new Map<string, string>();

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
      const game = await this.gameService.remakeGame(this.ingame.get(id));
      if (game == null) {
        this.logger.error('game not found');
        return;
      }
      this.ingame.delete(id);
      this.games[game.id].remake();
      this.games.delete(game.id);
    }
    if (this.matchmaking.includes(client)) {
      this.matchmaking.splice(this.matchmaking.indexOf(client), 1);
    }
    this.sendconnected();
  }

  //on connection
  async handleConnection(client: Socket) {
    let id;
    this.logger.debug('New connexion');
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
      this.logger.debug(`Client connected: ${id} for ${client.id}`);
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
    const friend_id = payload.friend_id;
    const user_id = getIdFromSocket(client, this.clients);
    this.logger.log(`new friend request from ${user_id} to ${friend_id}`);
    const user = await this.userService.getUserById(user_id);
    const friend = await this.userService.getUserById(friend_id);
    let ret;
    if (friend == null) {
      ret = {
        code: FriendCode.UNEXISTING_USER,
      };
    } else if (await this.userService.isfriend(user_id, friend_id)) {
      ret = {
        code: FriendCode.ALREADY_FRIEND,
      };
    } else if (await this.userService.asfriendrequestby(user_id, friend_id)) {
      await this.userService.removeFriendRequest(user_id, friend_id);
      this.logger.debug('friend id : ' + friend_id);
      if (getSocketFromId(friend_id, this.clients) != null) {
        this.logger.debug(
          'socket friend id : ' + getSocketFromId(friend_id, this.clients).id,
        );
        send = {
          code: FriendCode.NEW_FRIEND,
          id: user_id,
        };
        getSocketFromId(friend_id, this.clients).emit('friend_request', send);
      }
      await this.userService.addFriend(user_id, friend_id);
      await this.userService.addFriend(friend_id, user_id);
      ret = {
        code: FriendCode.NEW_FRIEND,
      };
    } else {
      ret = {
        code: FriendCode.FRIEND_REQUEST_SENT,
      };
      const requestFriend = await this.userService.addFriendRequest(
        user_id,
        friend_id,
      );
      this.logger.debug('friend id : ' + friend_id);
      console.log(this.clients);
      if (getSocketFromId(friend_id, this.clients) != null) {
        this.logger.debug(
          'socket friend id : ' + getSocketFromId(friend_id, this.clients).id,
        );
        send = {
          code: FriendCode.FRIEND_REQUEST,
          id: user.id,
          request: requestFriend.id,
        };
        getSocketFromId(friend_id, this.clients).emit('friend_request', send);
      }
    }
    this.logger.debug(`friend request code: ${ret.code}`);
    client.emit('friend_code', ret);
  }

  //on send message
  @SubscribeMessage('send_message')
  async handleMessage(client: Socket, payload: any) {
    if (
      payload.token == null ||
      payload.channel_id == null ||
      payload.content == null ||
      payload.channel_id.length <= 0
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
        user: msg.user,
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
    const channel_id = payload.channel_id;
    const user_id = getIdFromSocket(client, this.clients);
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
    this.logger.log(id + ' has joined matchmaking');
    this.matchmaking.push(client);
    const send = {
      code: 0,
    };
    client.emit('matchmaking_code', send);
    this.check_matchmaking();
  }

  async check_matchmaking() {
    let i = 0;
    while (i < this.matchmaking.length) {
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
          pretended_player_id != null &&
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
        if (
          this.server.sockets.sockets.get(player.id) != null ||
          this.server.sockets.sockets.get(rival.id) != null
        ) {
          await this.play_game(player, rival);
        }
      }
      i++;
    }
  }

  async play_game(player: Socket, rival: Socket) {
    const create_gameDTO = new CreateGameDTO();
    create_gameDTO.user1_id = getIdFromSocket(player, this.clients);
    create_gameDTO.user2_id = getIdFromSocket(rival, this.clients);
    if (create_gameDTO.user1_id == null || create_gameDTO.user2_id == null) {
      player.emit('game_found', {
        game_id: null,
        user: null,
        rival: null,
        decided: false,
      });
      return;
    }
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
    const FirstDecide = Math.random() < 0.5;
    player.emit('game_found', {
      game_id: create_game.id,
      user: 1,
      rival: create_gameDTO.user2_id,
      decide: FirstDecide,
    });
    rival.emit('game_found', {
      game_id: create_game.id,
      user: 2,
      rival: create_gameDTO.user1_id,
      decide: !FirstDecide,
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
    const tempmatchmaking = [];
    for (const t of this.matchmaking) {
      if (t.id != rival.id && player.id != t.id) {
        tempmatchmaking.push(player);
      }
    }
    this.matchmaking = tempmatchmaking;
    this.server.to(game.getId()).emit('game_created', game.getId());
    this.logger.log('game ' + game.getId() + ' created ');
  }

  @SubscribeMessage('option_send')
  async option_send(client: Socket, payload: any) {
    const user_id = getIdFromSocket(client, this.clients);
    const game_id = this.ingame.get(user_id);
    const game: Game = this.games[game_id];
    if (game == null) {
      return;
    } else {
      this.server.to(game_id).emit('will_started', { time: 3 });
      await sleep(1000);
      this.server.to(game_id).emit('option_receive', payload);
      this.server.to(game_id).emit('will_started', { time: 2 });
      await sleep(1000);
      this.server.to(game_id).emit('will_started', { time: 1 });
      await sleep(1000);
      this.server.to(game_id).emit('will_started', { time: 0 });
      await sleep(1000);
      game.start();
    }
  }
  @SubscribeMessage('input_game')
  async input_game(client: Socket, payload: any) {
    const game_id = payload.game_id;
    const type = payload.type;
    this.games[game_id].updateRacket(client, type);
    this.server
      .to(game_id)
      .emit('update_game', this.games[game_id].getGameInfo());
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
    client.emit('matchmaking_code', send);
  }

  @SubscribeMessage('game_finished')
  async game_finished(client: Socket, payload: any) {
    const rematch = payload.rematch;
    const id = getIdFromSocket(client, this.clients);
    const game_id = this.ingame.get(id);
    const game = this.games[game_id];
    if (game != null) {
      if (!rematch) {
        this.games.delete(game_id);
        game.getUser1().emit('rematch', { rematch: false });
        game.getUser2().emit('rematch', { rematch: false });
        this.ingame.delete(getIdFromSocket(game.getUser1(), this.clients));
        this.ingame.delete(getIdFromSocket(game.getUser2(), this.clients));
        this.logger.debug('game ' + game_id + ' finished');
      } else {
        if (this.rematch.get(game_id) == null) {
          this.rematch.set(game_id, true);
          const send = {
            rematch: true,
          };
          if (game.getUser1().id == client.id) {
            game.getUser2().emit('rematch', send);
          }
          if (game.getUser2().id == client.id) {
            game.getUser1().emit('rematch', send);
          }
        } else {
          this.rematch.delete(game_id);
          this.logger.debug('rematch');
          const send = {
            rematch: true,
          };
          game.getUser1().emit('rematch', send);
          game.getUser2().emit('rematch', send);
          this.ingame.delete(getIdFromSocket(game.getUser1(), this.clients));
          this.ingame.delete(getIdFromSocket(game.getUser2(), this.clients));
          this.rematch.delete(game_id);
          this.logger.debug('game ' + game_id + ' finished and rematch');
          this.play_game(game.getUser1(), game.getUser2());
          return;
        }
      }
    }
  }

  @SubscribeMessage('challenge')
  async dual_request(client: Socket, payload: any) {
    this.logger.debug('challenge');
    const rival_id = payload.rival_id;
    const socket = this.server.sockets.sockets.get(rival_id);
    if (socket != null) {
      if (this.dual.get(rival_id) != null) {
        if (this.dual.get(rival_id) == getIdFromSocket(client, this.clients)) {
          this.dual.delete(rival_id);
          socket.emit('receive_challenge', {
            message: 'ok game will started soon',
          });
          client.emit('receive_challenge', {
            message: 'ok game will started soon',
          });
          await this.play_game(client, socket);
        } else {
          client.emit('receive_challenge', {
            message: 'user is in dual',
          });
          return;
        }
      } else {
        this.dual.set(getIdFromSocket(client, this.clients), rival_id);
        socket.emit('receive_challenge', {
          rival: getIdFromSocket(client, this.clients),
        });
      }
    } else {
      client.emit('receive_challenge', {
        message: 'user is not connected',
      });
    }
  }

  @SubscribeMessage('leave_game')
  async leave_game(client: Socket, payload: any) {
    const id = getIdFromSocket(client, this.clients);
    const game_id = this.ingame.get(id);
    const game = this.games[game_id];
    if (game != null) {
      this.ingame.delete(getIdFromSocket(game.getUser1(), this.clients));
      this.ingame.delete(getIdFromSocket(game.getUser2(), this.clients));
      game.remake();
    } else {
      this.ingame.delete(id);
    }
  }

  @SubscribeMessage('unfriend_request')
  async unfriend_request(client: Socket, payload: any) {
    const friend_id = payload.friend_id;
    const user_id = getIdFromSocket(client, this.clients);
    if (await this.userService.isfriend(user_id, friend_id)) {
      await this.userService.removeFriends(user_id, friend_id);
      const mpchannel = await this.channelService.getmpchannel(
        user_id,
        friend_id,
      );
      await this.channelService.deletechannel(mpchannel.id);
      client.emit('friend_code', {
        code: FriendCode.UNFRIEND_SUCCESS,
      });
      if (getSocketFromId(friend_id, this.clients)) {
        getSocketFromId(friend_id, this.clients).emit('friend_code', {
          code: FriendCode.NEW_UNFRIEND,
          id: user_id,
        });
      }
    } else {
      client.emit('friend_code', {
        code: FriendCode.UNEXISTING_FRIEND,
      });
    }
  }

  @SubscribeMessage('research_name')
  async research_name(client: Socket, payload: any) {
    const name = payload.name;
    const user_id = getIdFromSocket(client, this.clients);
    const users = await this.userService.getUserBySimilarNames(name, user_id);
    client.emit('research_name', users);
  }

  @SubscribeMessage('invite_channel')
  async invite_channel(client: Socket, payload: any) {
    const channel_id = payload.channel_id;
    const receiver_id = payload.receiver_id;
    const sender_id = getIdFromSocket(client, this.clients);

    const receiver = await this.userService.getUserById(receiver_id);
    const sender = await this.userService.getUserById(sender_id);
    if (receiver == null || sender == null) {
      client.emit('invite_request', {
        code: ChannelCode.UNEXISTING_USER,
      });
      return;
    }
    const channel = await this.channelService.getChannelById(channel_id);
    if (channel == null) {
      client.emit('invite_request', {
        code: ChannelCode.UNEXISTING_CHANNEL,
      });
      let ch = null;
      try {
        ch = await this.channelService.inviteChannel(
          sender_id,
          receiver_id,
          channel_id,
        );
      } catch (e) {
        client.emit('invite_request', {
          message: e.message,
        });
        return;
      }
      if (ch != null) {
        client.emit('invite_request', {
          code: ChannelCode.INVITE_SUCCESS,
        });
      }
      return;
    }
  }

  @SubscribeMessage('update_channel')
  async update_channel(client: Socket, payload: any) {
    const channel_id = payload.channel_id;
    const user_id = getIdFromSocket(client, this.clients);
    let ret = null;
    try {
      ret = await this.channelService.updateChannel(
        channel_id,
        user_id,
        payload,
      );
    } catch (e) {
      client.emit('update_channel', {
        message: e.message,
      });
    }
    client.emit('update_channel', ret);
  }
}
