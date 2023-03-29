import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDto } from 'src/dto/create-channel.dto';
import { JoinChannelDto } from 'src/dto/join-channel.dto';
import { LeaveChannelDto } from 'src/dto/leave-channel.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Channel, Type } from './channel.entity';

@Injectable()
export class ChannelService {
    constructor(@InjectRepository(Channel) private channelRepository: Repository<Channel>, @InjectRepository(User) private userRepository: Repository<User>) {}

    public async createChannel(body : CreateChannelDto) {
        var chan = new Channel();
        chan.name = body.name;
        chan.admins = [];
        chan.bannedUsers = [];
        chan.users = [];
        chan.type = body.type;
        console.log(body);
        var user = await this.userRepository.findOneBy({id : body.creator_id});
        if (user == null)
            return null;
        chan.users.push(user);
        chan.admins.push(user);
        if (body.type == Type.PROTECTED_CHANNEL)
            chan.pwd = body.password;
        await this.channelRepository.save(chan);
        return chan;
    }

    public async createMPChannel(friend_id, friend_id1) {
        var chan = new Channel();
        chan.name = friend_id + " - " + friend_id1;
        chan.admins = [];
        chan.bannedUsers = [];
        chan.users = [];
        chan.type = Type.MP_CHANNEL;
        var user = await this.userRepository.findOneBy({id : friend_id});
        var user1 = await this.userRepository.findOneBy({id : friend_id1});
        chan.users.push(user);
        chan.users.push(user1);
        await this.channelRepository.save(chan);
        return chan;
    }

    public async getChannels() {
        return await this.channelRepository.find();
    }

    public async joinChannel(body: JoinChannelDto) {
        var chan = await this.channelRepository.findOneBy({id : body.channel_id});
        if (chan == null)
            return null;
        var user = await this.userRepository.findOneBy({id : body.user_id});
        if (user == null)
            return null;
        if (chan.type == Type.PROTECTED_CHANNEL && chan.pwd != body.password)
            return null;
        if (chan.bannedUsers.includes(user))
            return null;
        chan.users.push(user);
        await this.channelRepository.save(chan);
        return chan;
    }

    public async leaveChannel(body: LeaveChannelDto) {
        var chan = await this.channelRepository.findOneBy({id : body.channel_id});
        if (chan == null)
            return null;
        var user = await this.userRepository.findOneBy({id : body.user_id});
        if (user == null)
            return null;
        chan.users = chan.users.filter((u) => u.id != user.id);
    }

    public async addAdmin(body) {
        return null;
    }

    public async removeAdmin(body) {
        return null;
    }
}
