import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserService } from '../user/user.service';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { getSocketFromId, getSockets } from '../utils/socket.function';
import { FriendCode } from '../utils/requestcode.enum';
import { ChannelService } from '../channel/channel.service';
import { addAdminDto } from '../dto/add-admin.dto';

@WebSocketGateway()
export class UserGateway implements OnGatewayInit {
  @WebSocketServer() server;
  private logger: Logger = new Logger('UserGateway');

  constructor(
    private userService: UserService,
    private channelService: ChannelService,
  ) {}

  afterInit() {
    this.logger.log('building in progress');
  }

  @SubscribeMessage('research_name')
  async research_name(client: Socket, payload: any) {
    const name = payload.name;
    const user_id = client.data.id;
    this.logger.log('research_name + ' + user_id);
    const users = await this.userService.getUserBySimilarNames(name, user_id);
    console.log(users);
    client.emit('research_name', users);
  }

  @SubscribeMessage('friend_request') //reception d'une demande d'ami / accepter une demande d'ami
  async handleFriendRequest(client: Socket, payload: any) {
    let send;
    const friend_id = payload.friend_id;
    const user_id = client.data.id;
    this.logger.log(`new friend request from ${user_id} to ${friend_id}`);
    const user = await this.userService.getUserById(user_id);
    const friend = await this.userService.getUserById(friend_id);
    let ret;
    let friend_socket: Socket | null;
    if (friend != null) {
      friend_socket = getSocketFromId(friend_id, getSockets(this.server));
    }
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
      if (friend_socket != null) {
        send = {
          code: FriendCode.NEW_FRIEND,
          id: user_id,
        };
        friend_socket.emit('friend_request', send);
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
      if (friend_socket != null) {
        send = {
          code: FriendCode.FRIEND_REQUEST,
          id: user.id,
          request: requestFriend.id,
        };
        friend_socket.emit('friend_request', send);
      }
    }
    this.logger.debug(`friend request code: ${ret.code}`);
    client.emit('friend_code', ret);
  }

  @SubscribeMessage('unfriend_request')
  async unfriend_request(client: Socket, payload: any) {
    const friend_id = payload.friend_id;
    const user_id = client.data.id;
    const friend_socket = getSocketFromId(friend_id, getSockets(this.server));
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
      if (friend_socket != null) {
        friend_socket.emit('friend_code', {
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

  @SubscribeMessage('block_user')
  async block_user(client: Socket, payload: any) {
    const user_id = client.data.id;
    const block_id = payload.block_id;
    if (block_id == null) {
      client.emit('block_code', {
        message: 'block_id is null',
      });
      return;
    }
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

  @SubscribeMessage('unblock_user')
  async unblock_user(client: Socket, payload: any) {
    const user_id = client.data.id;
    const unblock_id = payload.unblock_id;
    try {
      const user = await this.userService.removeBlocked(user_id, unblock_id);
      client.emit('block_code', {
        message: 'ok',
      });
    } catch (e) {
      client.emit('block_code', {
        message: e.message,
      });
    }
  }
}
