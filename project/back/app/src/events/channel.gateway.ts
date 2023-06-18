import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChannelService } from '../channel/channel.service';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChannelCode, messageCode } from '../utils/requestcode.enum';
import {
  getSocketFromId,
  getSockets,
  verifyToken,
  wrongtoken,
} from '../utils/socket.function';
import { UserService } from '../user/user.service';
import { sendMessageDTO } from '../dto/sendmessage.dto';
import { AuthService } from '../auth/auth.service';
import { JoinChannelDto } from '../dto/join-channel.dto';
import { BanUserDto } from '../dto/ban-user.dto';

@WebSocketGateway()
export class ChannelGateway implements OnGatewayInit {
  @WebSocketServer() server;
  private logger: Logger = new Logger('ChannelGateway');

  constructor(
    private channelService: ChannelService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  afterInit() {
    this.logger.log('building in progress');
  }

  @SubscribeMessage('invite_channel')
  async invite_channel(client: Socket, payload: any) {
    const channel_id = payload.channel_id;
    const receiver_id = payload.receiver_id;
    const sender_id = client.data.id;
    const receiver = await this.userService.getUserById(receiver_id);
    const sender = await this.userService.getUserById(sender_id);
    const channel = await this.channelService.getChannelById(channel_id);
    if (receiver == null || sender == null) {
      client.emit('update_user_channel', {
        code: 1,
        sender_id: sender_id,
        message: 'user not found',
        channel: channel,
      });
      this.server.to(channel_id).emit('update_user_channel', {
        code: 1,
        sender_id: sender_id,
        channel: channel,
      });
      return;
    }
    if (channel == null) {
      client.emit('update_user_channel', {
        code: 1,
        sender_id: sender_id,
        message: 'channel not found',
        channel: channel,
      });
      this.server.to(channel_id).emit('update_user_channel', {
        code: 1,
        channel: channel,
        sender_id: sender_id,
      });
    } else {
      let ch = null;
      try {
        ch = await this.channelService.inviteChannel(
          sender_id,
          receiver_id,
          channel_id,
        );
      } catch (e) {
        client.emit('update_user_channel', {
          code: 1,
          channel: channel,
          sender_id: sender_id,
          message: e.message,
        });
        this.server.to(channel_id).emit('update_user_channel', {
          code: 1,
          channel: channel,
          sender_id: sender_id,
        });
        return;
      }
      if (ch != null) {
        const socket = getSocketFromId(receiver_id, getSockets(this.server));
        socket.join(channel_id);
        socket.emit('update_user_channel', {
          code: 0,
          channel: ch,
          sender_id: sender_id,
          message: 'ok',
        });
        this.server.to(channel_id).emit('update_user_channel', {
          code: 0,
          channel: ch,
          sender_id: sender_id,
        });
      }
      return;
    }
  }

  @SubscribeMessage('update_channel')
  async update_channel(client: Socket, payload: any) {
    const channel_id = payload.channel_id;
    const user_id = client.data.id;
    let ret = null;
    try {
      ret = await this.channelService.updateChannel(
        channel_id,
        user_id,
        payload,
      );
    } catch (e) {
      client.emit('update_user_channel', {
        code: 1,
        channel: channel_id,
        message: e.message,
      });
    }
    client.emit('update_channel', ret);
  }

  @SubscribeMessage('send_message')
  async handleMessage(client: Socket, payload: any) {
    this.logger.debug('send_message');
    this.logger.debug(payload.content);
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
    const user_id = client.data.id;
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
    }
    client.emit('message_code', send);
  }

  @SubscribeMessage('join_channel')
  async handleJoinChannel(client: Socket, payload: any) {
    let send;
    const channel_id = payload.channel_id;
    const user_id = client.data.id;
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
      channel_id: channel_id,
      channel: channel,
    };
    if (channel == null) {
      send = {
        code: 1,
        channel_id: channel_id,
        channel: channel,
      };
    } else if (!(await this.channelService.isInChannel(user.id, channel.id))) {
      let ch;
      const ChannelDTO = new JoinChannelDto();
      ChannelDTO.channel_id = channel_id;
      ChannelDTO.user_id = user_id;
      if (payload.password != null) {
        ChannelDTO.password = payload.password;
      }
      try {
        ch = await this.channelService.joinChannel(ChannelDTO);
        client.join(channel_id);
        send = {
          code: 2,
          channel_id: channel_id,
          channel: ch,
        };
        this.server.to(channel_id).emit('user_join', send);
      } catch (e) {
        send = {
          code: 1,
          channel_id: channel_id,
          channel: channel,
          message: e.message,
        };
        client.emit('join_code', send);
        return;
      }
    } else {
      client.join(channel_id);
      send = {
        code: 0,
        channel_id: channel_id,
        channel: channel,
      };
    }
    client.emit('join_code', send);
    send = {
      user_id: user.id,
      channel_id: channel_id,
      channel: channel,
    };
    this.server.to(channel_id).emit('user_join', send);
  }

  @SubscribeMessage('leave_channel')
  async handleLeaveChannel(client: Socket, payload: any) {
    let send;
    const token = payload.token;
    const channel_id = payload.channel_id;
    const user_id = client.data.id;
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
      await this.channelService.leaveChannel(user.id, channel.id);
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

  @SubscribeMessage('ban_user')
  async ban_user(client: Socket, payload: any) {
    const user_id = client.data.id;
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
    const user_id = client.data.id;
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
}
