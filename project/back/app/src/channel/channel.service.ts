import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addAdminDTO } from 'src/dto/addadmin.dto';
import { CreateChannelDto } from 'src/dto/create-channel.dto';
import { JoinChannelDto } from 'src/dto/join-channel.dto';
import { LeaveChannelDto } from 'src/dto/leave-channel.dto';
import { sendMessageDTO } from 'src/dto/sendmessage.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Channel} from './channel.entity';
import { Message } from './message.entity';
import { ChannelType } from 'src/utils/channel.enum';

@Injectable()
export class ChannelService {
    constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>, private readonly userService : UserService) {}

    public async createChannel(body : CreateChannelDto) {
        var chan = new Channel();
        chan.name = body.name;
        chan.admins = [];
        chan.bannedUsers = [];
        chan.users = [];
        chan.type = body.type;
        console.log(body);
        var user = await this.userService.getUserById(body.creator_id);
        console.log(body.creator_id);
        if (user == null)
            return null;
        chan.users.push(user);
        chan.admins.push(user);
        if (body.type == ChannelType.PROTECTED_CHANNEL)
            chan.pwd = body.password;
        await this.channelRepository.save(chan);
        return chan;
    }

    public async createMPChannel(user_id, user_id1) {
        var chan = new Channel();
        chan.name = user_id + " - " + user_id1;
        chan.admins = [];
        chan.bannedUsers = [];
        chan.users = [];
        chan.type = ChannelType.MP_CHANNEL;
        var user = await this.userService.getUserById(user_id);
        var user1 = await this.userService.getUserById(user_id1);
        chan.users.push(user);
        chan.users.push(user1);
        await this.channelRepository.save(chan);
        return chan;
    }

    public async getChannelById(id) {
        return await this.channelRepository.findOneBy({id : id});
    }

    public async isInChannel(user_id, channel_id) {
        var chan = await this.channelRepository.findOneBy({id : channel_id});
        if (chan == null)
            return false;
        var user = await this.userService.getUserById(user_id);
        if (user == null)
            return false;
        return chan.users.includes(user);
    }

    public async getChannels() {
        return await this.channelRepository.find();
    }

    public async joinChannel(body: JoinChannelDto) {
        var chan = await this.channelRepository.findOneBy({id : body.channel_id});
        if (chan == null)
            return null;
        var user = await this.userService.getUserById(body.user_id);
        if (user == null)
            return null;
        if (chan.type == ChannelType.PROTECTED_CHANNEL && chan.pwd != body.password)
            return null;
        if ( chan.bannedUsers != null && chan.bannedUsers.includes(user))
            return null;
        chan.users.push(user);
        await this.channelRepository.save(chan);
        return chan;
    }

    public async leaveChannel(body: LeaveChannelDto) {
        var chan = await this.channelRepository.findOneBy({id : body.channel_id});
        if (chan == null)
            return null;
        var user = await this.userService.getUserById(body.user_id);
        if (user == null)
            return null;
        chan.users = chan.users.filter((u) => u.id != user.id);
    }

    public async addAdmin(body: addAdminDTO) {
        var user = await this.userService.getUserById(body.user_id);
        if (user == null)
            return null;
        var chan = await this.channelRepository.findOneBy({id : body.channel_id});
        if (chan == null)
            return null;
        chan.admins.push(user);
        await this.channelRepository.save(chan);
        return chan;
    }

    public async banUser(body: addAdminDTO) {
        var user = await this.userService.getUserById(body.user_id);

        if (user == null)
            return null;
        var chan = await this.channelRepository.findOneBy({id : body.channel_id});
        if (chan == null)
            return null;
        await chan.bannedUsers.push(user);
        await chan.users.filter((u) => u.id != user.id);
        await this.channelRepository.save(chan);
    }

    public async getMessage(channel_id, user_id) {
        var user = await this.userService.getUserById(user_id);
        if (user == null)
            return null;
        var chan = await this.channelRepository.findOneBy({id : channel_id});
        if (chan == null)
            return null;
        if (chan.users.includes(user) == false)
            throw new Error("User is not in channel");
        chan.messages = chan.messages.sort((a, b) => a.date.getMilliseconds() - b.date.getMilliseconds());
        return chan.messages;
    }

    public async sendMessage(body: sendMessageDTO) {
        var message = new Message;
        message.content = body.content;
        message.date = new Date;
        var user = await this.userService.getUserById(body.user_id);
        if (user == null)
            return null;
        
        var channel = await this.channelRepository.createQueryBuilder("channel").leftJoinAndSelect("channel.messages", "messages").where("channel.id = :id", {id : body.channel_id}).getOne();
        if (channel == null)
            return null;
        message.channel = channel.id;
        message.user = user;
        console.log(message);
        if (channel.messages == null)
            channel.messages = [];
        channel.messages.push(message);
        await this.channelRepository.save(channel);
        return message;
    }
}
