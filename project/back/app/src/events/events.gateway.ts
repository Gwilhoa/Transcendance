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
import { GameService } from 'src/game/game.service';
import { CreateGameDTO } from 'src/dto/create-game.dto';
import { UserStatus } from 'src/utils/user.enum';
import {
  disconnect,
  getKeys,
  send_connection_server,
  wrongtoken,
} from 'src/utils/socket.function';
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
  private clients: string[] = [];
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
    const id = client.data.id;
    if (id == null) {
      client.disconnect();
      return;
    }
    this.logger.log(`Client disconnected: ${id}`);
    if ((await this.userService.changeStatus(id, UserStatus.OFFLINE)) == null) {
      wrongtoken(client);
      this.clients = disconnect(id, this.clients);
      this.sendconnected();
    }
    this.clients = disconnect(id, this.clients);
    if (getKeys(this.ingame).includes(id)) {
      const game = await this.gameService.remakeGame(this.ingame.get(id));
      if (game == null) {
        this.logger.error('game not found');
        return;
      }
      this.ingame.delete(id);
      await this.games[game.id].remake();
      this.games.delete(game.id);
    }
    if (this.matchmaking.includes(client)) {
      this.matchmaking.splice(this.matchmaking.indexOf(client), 1);
    }
    this.sendconnected();
  }

  //on connection
  async handleConnection(client: Socket) {
    client.setMaxListeners(20);
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
      client.data.id = id;
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
        const player_id = player.data.id;
        const pretended_player_id = pretended_player.data.id;
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
    create_gameDTO.user1_id = player.data.id;
    create_gameDTO.user2_id = rival.data.id;
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
    const user_id = client.data.id;
    const game_id = this.ingame.get(user_id);
    const game: Game = this.games[game_id];
    game.definePowerUp(payload.powerup);
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
    console.log('leave_matchmaking');
    const tempmatchmaking = [];
    let send = {
      code: 1,
    };
    for (const t of this.matchmaking) {
      if (t.id != client.id) {
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
    const id = client.data.id;
    const game_id = this.ingame.get(id);
    const game = this.games[game_id];
    if (game != null) {
      if (!rematch) {
        this.games.delete(game_id);
        game.getUser1().emit('rematch', { rematch: false });
        game.getUser2().emit('rematch', { rematch: false });
        this.ingame.delete(game.getUser1().data.id);
        this.ingame.delete(game.getUser2().data.id);
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
          this.ingame.delete(game.getUser1().data.id);
          this.ingame.delete(game.getUser2().data.id);
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
        if (this.dual.get(rival_id) == client.data.id) {
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
        this.dual.set(client.data.id, rival_id);
        socket.emit('receive_challenge', {
          rival: client.data.id,
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
    const id = client.data.id;
    const game_id = this.ingame.get(id);
    const game = this.games[game_id];
    if (game != null) {
      this.ingame.delete(client.data.id);
      this.ingame.delete(client.data.id);
      game.remake();
    } else {
      this.ingame.delete(id);
    }
  }
<<<<<<< HEAD

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
    this.logger.debug('invite_channel');
    this.logger.debug(payload);
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
    } else {
      let ch = null;
      try {
        this.logger.debug('invite_channel');
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
        const socket = getSocketFromId(receiver_id, this.clients);
        const send = {
          user_id: receiver_id,
          channel_id: channel_id,
          channel: ch,
        };
        socket.join(channel_id);
        socket.emit('join_code', send);
      }
      return;
    }
  }

  @SubscribeMessage('update_channel')
  async update_channel(client: Socket, payload: any) {
    this.logger.debug('update_channel');
    this.logger.debug(payload);
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

  @SubscribeMessage('add_admin')
  async add_admin(client: Socket, payload: any) {
    const user_id = getIdFromSocket(client, this.clients);
    const channel_id = payload.channel_id;
    const admin_id = payload.admin_id;
    const addAdmin = new addAdminDto();
    addAdmin.channel_id = channel_id;
    addAdmin.user_id = admin_id;
    try {
      const chan = await this.channelService.addAdmin(addAdmin, user_id);
      if (chan != null) {
        this.server.to(chan.id).emit('admin_code', {
          channel_id: chan.id,
          admins: chan.admins,
        });
      }
      client.emit('admin_code', {
        message: 'ok',
      });
    } catch (e) {
      client.emit('add_admin', {
        message: e.message,
      });
      return;
    }
  }

  @SubscribeMessage('remove_admin')
  async remove_admin(client: Socket, payload: any) {
    const user_id = getIdFromSocket(client, this.clients);
    const channel_id = payload.channel_id;
    const admin_id = payload.admin_id;
    const addAdmin = new addAdminDto();
    addAdmin.channel_id = channel_id;
    addAdmin.user_id = admin_id;
    try {
      const chan = await this.channelService.deleteAdmin(addAdmin, user_id);
      if (chan != null) {
        this.server.to(chan.id).emit('admin_code', {
          channel_id: chan.id,
          admins: chan.admins,
        });
      }
      client.emit('admin_code', {
        message: 'ok',
      });
    } catch (e) {
      client.emit('admin_code', {
        message: e.message,
      });
      return;
    }
  }

  @SubscribeMessage('ban_user')
  async ban_user(client: Socket, payload: any) {
    const user_id = getIdFromSocket(client, this.clients);
    const channel_id = payload.channel_id;
    const ban_id = payload.ban_id;
    const addBan = new BanUserDto();
    addBan.channel_id = channel_id;
    addBan.user_id = ban_id;
    try {
      const chan = await this.channelService.banUser(addBan, user_id);
      if (chan != null) {
        this.server.to(chan.id).emit('ban_code', {
          channel_id: chan.id,
          bans: chan.bannedUsers,
        });
      }
    } catch (e) {
      client.emit('ban_code', {
        message: e.message,
      });
      return;
    }
  }

  @SubscribeMessage('unban_user')
  async unban_user(client: Socket, payload: any) {
    const user_id = getIdFromSocket(client, this.clients);
    const channel_id = payload.channel_id;
    const ban_id = payload.unban_id;
    const addBan = new BanUserDto();
    addBan.channel_id = channel_id;
    addBan.user_id = ban_id;
    try {
      const chan = await this.channelService.deleteBanUser(addBan, user_id);
      if (chan != null) {
        this.server.to(chan.id).emit('ban_code', {
          channel_id: chan.id,
          bans: chan.bannedUsers,
        });
      }
    } catch (e) {
      client.emit('ban_code', {
        message: e.message,
      });
      return;
    }
  }

  @SubscribeMessage('block_user')
  async block_user(client: Socket, payload: any) {
    console.log('bloqué');
    const user_id = getIdFromSocket(client, this.clients);
    const block_id = payload.block_id;
    try {
      const user = await this.userService.addBlocked(user_id, block_id);
      client.emit('block_code', {
        message: 'ok',
      });
    } catch (e) {
      client.emit('block_code', {
        message: e.message,
      });
      return;
    }
  }
=======
>>>>>>> origin/refactoChat
}
