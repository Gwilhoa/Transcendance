import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addAdminDto } from 'src/dto/add-admin.dto';
import { CreateChannelDto } from 'src/dto/create-channel.dto';
import { JoinChannelDto } from 'src/dto/join-channel.dto';
import { sendMessageDTO } from 'src/dto/sendmessage.dto';
import { UserService } from 'src/user/user.service';
import { Like, Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Message } from './message.entity';
import { ChannelType } from 'src/utils/channel.enum';
import { BanUserDto } from '../dto/ban-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  public async createChannel(body: CreateChannelDto) {
    let chan = new Channel();
    chan.name = body.name;
    chan.admins = [];
    chan.bannedUsers = [];
    chan.users = [];
    chan.type = body.type;
    const user = await this.userService.getUserById(body.creator_id);
    if (user == null) throw new Error('User not found');
    chan.users.push(user);
    chan.admins.push(user);
    if (body.type == ChannelType.PROTECTED_CHANNEL) {
      if (body.password == null)
        throw new Error('Password is required for PROTECTED_CHANNEL');
      try {
        chan.pwd = await argon2.hash(body.password);
      } catch (err) {
        throw new Error('Can not hash password');
      }
    }
    chan = await this.channelRepository.save(chan);
    return chan;
  }

  public async createMPChannel(user_id, user_id1) {
    const channels = await this.channelRepository.find();
    for (const chan of channels) {
      if (chan.type == ChannelType.MP_CHANNEL) {
        if (chan.name == user_id + ' - ' + user_id1) throw new Error('Channel already exists');
      }
    }
    const chan = new Channel();
    chan.name = user_id + ' - ' + user_id1;
    chan.admins = [];
    chan.bannedUsers = [];
    chan.users = [];
    chan.type = ChannelType.MP_CHANNEL;
    const user = await this.userService.getUserById(user_id);
    const user1 = await this.userService.getUserById(user_id1);
    chan.users.push(user);
    chan.users.push(user1);
    await this.channelRepository.save(chan);
    return chan;
  }

  public async getChannelById(id) {
    return await this.channelRepository.findOneBy({ id: id });
  }

  public async isInChannel(user_id: string, channel_id: string) {
    const chan = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'users')
      .where('channel.id = :id', { id: channel_id })
      .getOne();
    if (chan == null) return false;
    const user = await this.userService.getUserById(user_id);
    if (user == null) return false;
    let chanuser;
    for (chanuser of chan.users) {
      if (user.id == chanuser.id) return true;
    }
    return chan.users.includes(user);
  }

  public async joinChannel(body: JoinChannelDto) {
    let chan = await this.channelRepository.findOneBy({
      id: body.channel_id,
    });
    if (chan == null) throw new Error('Channel not found');
    const user = await this.userService.getUserById(body.user_id);
    if (user == null) throw new Error('User not found');
    if (chan.type == ChannelType.PROTECTED_CHANNEL) {
      if (body.password == null)
        throw new Error('Password is required for PROTECTED_CHANNEL');
      let isvalid = false;
      try {
        isvalid = await argon2.verify(chan.pwd, body.password);
      } catch (err) {
        throw new Error('Can not verify password');
      }
      if (isvalid == false)
        throw new Error('Password is not valid for this channel');
    }
    if (chan.bannedUsers != null && chan.bannedUsers.includes(user))
      throw new Error('User is banned');
    chan.users.push(user);
    chan = await this.channelRepository.save(chan);
    return chan;
  }

  public async leaveChannel(user_id, channel_id) {
    const chan = await this.channelRepository.findOneBy({
      id: channel_id,
    });
    if (chan == null) throw new Error('Channel not found');
    const user = await this.userService.getUserById(user_id);
    if (user == null) throw new Error('User not found');
    if (!chan.users.includes(user)) throw new Error('User not in channel');
    chan.users = chan.users.filter((u) => u.id != user.id);
    await this.channelRepository.save(chan);
    return user;
  }

  public async addAdmin(body: addAdminDto, user_id) {
    const target = await this.userService.getUserById(body.user_id);
    const user = await this.userService.getUserById(user_id);
    if (user == null || target == null) throw new Error('User not found');
    let chan = await this.channelRepository.findOneBy({
      id: body.channel_id,
    });
    if (chan == null) throw new Error('Channel not found');
    if (!chan.admins.includes(user))
      throw new Error('User is not admin of this channel');
    if (chan.admins.includes(target))
      throw new Error('User is already admin of this channel');
    if (!chan.users.includes(target))
      throw new Error('User is not in this channel');
    chan.admins.push(target);
    chan = await this.channelRepository.save(chan);
    return chan;
  }

  public async banUser(body: BanUserDto, user_id) {
    const target = await this.userService.getUserById(body.user_id);
    const user = await this.userService.getUserById(user_id);

    if (user == null || target == null) throw new Error('User not found');
    const chan = await this.channelRepository.findOneBy({
      id: body.channel_id,
    });
    if (chan == null) throw new Error('Channel not found');
    if (!chan.admins.includes(user))
      throw new Error('User is not admin of this channel');
    if (!chan.users.includes(target))
      throw new Error('User is not in this channel');
    if (chan.admins.includes(target))
      throw new Error('User is admin of this channel');
    chan.bannedUsers.push(user);
    chan.users.filter((u) => u.id != user.id);
    return await this.channelRepository.save(chan);
  }

  public async getMessage(channel_id, user_id) {
    const user = await this.userService.getUserById(user_id);
    if (user == null) throw new Error('User not found');
    const chan = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.messages', 'messages')
      .leftJoinAndSelect('messages.user', 'user')
      .where('channel.id = :id', { id: channel_id })
      .getOne();
    if (chan == null) throw new Error('Channel not found');
    if (!chan.users.includes(user))
      throw new Error('User is not in this channel');
    if (chan.messages == null || chan.messages.length == 0) return null;
    return chan.messages.filter(
      async (m) =>
        (await this.userService.isBlocked(user.id, m.user.id)) == false,
    );
  }

  public async sendMessage(body: sendMessageDTO, user_id) {
    if (body.content.length > 4242 || body.content.length <= 0)
      throw new Error('Message too long (max 4242) or empty');
    const message = new Message();
    message.content = body.content;
    message.date = new Date();
    const user = await this.userService.getUserById(user_id);
    if (user == null) throw new Error('User not found');
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.messages', 'messages')
      .where('channel.id = :id', { id: body.channel_id })
      .getOne();
    if (channel == null) throw new Error('Channel not found');
    message.channel = channel;
    message.user = user;
    if (channel.messages == null) channel.messages = [];
    channel.messages.push(message);
    await this.channelRepository.save(channel);
    const ret = await this.messageRepository.save(message);
    ret.channel = null;
    return ret;
  }

  async getChannelsByName(name: string) {
    return await this.channelRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  async getAccessibleChannels(user_id: string) {
    const user = await this.userService.getUserById(user_id);
    if (user == null) throw new Error('User not found');
    const channels = await this.channelRepository.find();
    console.log(channels);
    let channel;
    for (channel of channels) {
      if (!channel.users.includes(user))
        channels.filter((c) => c.id != channel.id);
    }
    return channels;
  }

  async getAvailableChannels(id: string) {
    const user = await this.userService.getUserById(id);
    if (user == null) throw new Error('User not found');
    const channels = await this.channelRepository.find();
    if (channels == null) return null;
    channels.filter((c) => !c.users.includes(user));
    channels.filter((c) => c.type != ChannelType.PRIVATE_CHANNEL);
    channels.filter(
      (c) => c.bannedUsers != null && c.bannedUsers.includes(user),
    );
    channels.filter((c) => c.type != ChannelType.MP_CHANNEL);
    if (channels.length == 0) return null;
    return channels;
  }

  async getAdmin(body: addAdminDto, id: string) {
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.admins', 'admins')
      .where('channel.id = :id', { id: body.channel_id })
      .getOne();
    if (channel == null) throw new Error('Channel not found');
    const user = await this.userService.getUserById(id);
    if (user == null) throw new Error('User not found');
    if (!channel.users.includes(user))
      throw new Error('User is not in this channel');
    return channel.admins;
  }

  async deleteAdmin(body: addAdminDto, id: string) {
    const self_user = await this.userService.getUserById(id);
    if (self_user == null) throw new Error('User not found');
    const target = await this.userService.getUserById(body.user_id);
    if (target == null) throw new Error('User not found');
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.admins', 'admins')
      .where('channel.id = :id', { id: body.channel_id })
      .getOne();
    if (channel == null) throw new Error('Channel not found');
    if (!channel.users.includes(self_user))
      throw new Error('User is not in this channel');
    if (!channel.admins.includes(self_user))
      throw new Error('User is not admin of this channel');
    if (!channel.admins.includes(target))
      throw new Error('User is not admin of this channel');
    channel.admins.filter((u) => u.id != target.id);
    return await this.channelRepository.save(channel);
  }

  async getBanUser(channel_id, user_id) {
    const user = await this.userService.getUserById(user_id);
    if (user == null) throw new Error('User not found');
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.bannedUsers', 'bannedUsers')
      .where('channel.id = :id', { id: channel_id })
      .getOne();
    if (channel == null) throw new Error('Channel not found');
    if (!channel.users.includes(user))
      throw new Error('User is not in this channel');
    if (!channel.admins.includes(user))
      throw new Error('User is not admin of this channel');
    return channel.bannedUsers;
  }

  async deleteBanUser(body: BanUserDto, id: string) {
    const self_user = await this.userService.getUserById(id);
    if (self_user == null) throw new Error('User not found');
    const target = await this.userService.getUserById(body.user_id);
    if (target == null) throw new Error('User not found');
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.bannedUsers', 'bannedUsers')
      .where('channel.id = :id', { id: body.channel_id })
      .getOne();
    if (channel == null) throw new Error('Channel not found');
    if (!channel.users.includes(self_user))
      throw new Error('User is not in this channel');
    if (!channel.admins.includes(self_user))
      throw new Error('User is not admin of this channel');
    if (!channel.bannedUsers.includes(target))
      throw new Error('User is not banned of this channel');
    channel.bannedUsers.filter((u) => u.id != target.id);
    return await this.channelRepository.save(channel);
  }
}
