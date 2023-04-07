import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import fetch from 'node-fetch';
import { use } from 'passport';
import { RequestFriend } from './requestfriend.entity';
import { Type } from 'src/channel/channel.entity';


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, private authService: AuthService) {}

    public async getPathImage(id: string) {
        console.log(id);
        const path = require('path');
        const fs = require('fs');
        const imageDir = path.join(__dirname, '..', '..', '..', 'images');
        const files = await fs.promises.readdir(imageDir);
        const matchingFiles = files.filter((file) => file.startsWith(id));
        if (matchingFiles.length == 0) {
            return null;
        }
        return path.join(imageDir, matchingFiles[0]);
    }

    public asfriendrequestby(user: User, friend: User) {
        if (user.requestsReceived == null) {
            return false;
        }
        for (var i = 0; i < user.requestsReceived.length; i++) {
            if (user.requestsReceived[i].sender.id == friend.id) {
                return true;
            }
        }
        return false;
    }

    public isfriend(user: User, friend: User) {
        if (user.friends == null) {
            return false;
        }
        for (var i = 0; i < user.friends.length; i++) {
            if (user.friends[i].id == friend.id) {
                return true;
            }
        }
        return false;
    }

    public async createUsers(code) {
        const retIntra =  await this.authService.getIntraToken(code);
        if (retIntra == null) {
            return null;
        }
        await this.test();
        const retUser = await this.authService.getUserIntra(retIntra.access_token);
        console.log(retUser.id);
        console.log(retUser.login);
        console.log(retUser.image.link);
        console.log(retUser.email);
        var fs = require('fs');
        const user = new User();
        user.id = retUser.id;
        user.username = retUser.login;
        user.email = retUser.email;
        var avatar_url = retUser.image.link;
        var request = await fetch(avatar_url);
        var buffer = await request.buffer();
        fs.mkdirSync(__dirname+'/../../../images', { recursive: true });
        var image = await this.setAvatar(user.id, buffer, '.jpg');
        if (image == null ) {
            return null;
        }
        if (await this.userRepository.findOneBy({id : user.id}) != null) {
            return user;
        }
        await this.userRepository.save(user);
        return user;
    }

    public async getUsers() {
        return await this.userRepository.find();
    }

    public async getUserById(id: string) {
        return await this.userRepository.findOneBy({id : id});
    }

    public async getImageById(id: string) {
        var user = await this.userRepository.findOneBy({id : id});
        if (user == null) {
            return null;
        }
        var path = __dirname+'/../../../images/' + user.id + '.jpg';
        return path;
    }
    
    public async addFriend(id: string, friend_id: string) {
        var user = await this.userRepository.findOneBy({id : id});
        var friend = await this.userRepository.findOneBy({id : friend_id});
        if (user == null || friend == null) {
            throw new Error('User not found');
        }
        if (user == friend) {
            throw new Error('Cannot add yourself as a friend');
        }
        if (!user.friends) {
            user.friends = [];
        }
        user.friends.push(friend);
        await this.userRepository.save(user);
        await this.userRepository.save(friend);
        return user;
    }

    public async getFriends(id: string) {
        const user = await this.userRepository.createQueryBuilder("user")
          .leftJoinAndSelect("user.friends", "friends")
          .where("user.id = :id", { id })
          .getOne();
      
        if (!user) {
          return null;
        }
      
        console.log(user.friends);
        return user.friends;
      }

    public async test() {
        if (await this.userRepository.findOneBy({id : '1'}) != null) {
            return null;
        }
        var user = new User();
        user.id = '1';
        user.username = 'test';
        user.email = 'test@student.42lyon.fr';
        await this.userRepository.save(user);
        return user;
    }

    public async addBlocked(id: string, blocked_id: string) {
        var user = await this.userRepository.findOneBy({id : id});
        var blocked = await this.userRepository.findOneBy({id : blocked_id});
        if (user == null || blocked == null) {
            throw new Error('User not found');
        }
        if (user == blocked) {
            throw new Error('Cannot block yourself');
        }
        if (!user.blockedUsers) {
            user.blockedUsers = [];
        }
        user.blockedUsers.push(blocked);
        await this.userRepository.save(user);
        await this.userRepository.save(blocked);
        return user;
    }

    public async getBlocked(id: string) {
        const user = await this.userRepository.createQueryBuilder("user")
          .leftJoinAndSelect("user.blockedUsers", "blockedUsers")
          .where("user.id = :id", { id })
          .getOne();
        if (!user) {
          return null;
        }
        return user.blockedUsers;
    }

    public async getChannels(id: string) {
        const user = await this.userRepository.createQueryBuilder("user")
          .leftJoinAndSelect("user.joinedChannels", "channels")
          .where("user.id = :id", { id })
          .getOne();
        if (!user) {
          return null;
        }
        return user.joinedChannels;
    }

    public async getFriendRequests(id: string) {
        const user = await this.userRepository.createQueryBuilder("user")
          .leftJoinAndSelect("user.friendRequests", "friendRequests")
          .where("user.id = :id", { id })
          .getOne();
        if (!user) {
          return null;
        }
        return user.requestsReceived;
    }

    public async addFriendRequest(id: string, friend_id: string) {
        var user = await this.userRepository.findOneBy({id : id});
        var friend = await this.userRepository.findOneBy({id : friend_id});
        if (user == null || friend == null) {
            throw new Error('User not found');
        }
        if (user == friend) {
            throw new Error('Cannot add yourself as a friend');
        }
        if (!user.requestsReceived) {
            user.requestsReceived = [];
        }
        var friendrequest = new RequestFriend();
        friendrequest.sender = user;
        friendrequest.receiver = friend;
        user.requestsReceived.push(friendrequest);
        await this.userRepository.save(user);
        await this.userRepository.save(friend);
        return user;
    }

    public async removeFriendRequest(id: string, friend_id: string) {
        var user = await this.userRepository.findOneBy({id : id});
        var friend = await this.userRepository.findOneBy({id : friend_id});
        if (user == null || friend == null) {
            return null;
        }
        if (user == friend) {
            return null;
        }
        if (!user.requestsReceived || user.requestsReceived.length == 0) {
            return null;
        }
        user.requestsReceived = user.requestsReceived.filter((request) => request.receiver.id != friend.id);
        await this.userRepository.save(user);
        await this.userRepository.save(friend);
        return user;
    }

    public async setName(id: string, name: string) {
        var user = await this.userRepository.findOneBy({id : id});
        if (user == null) {
            return null;
        }
        user.username = name;
        await this.userRepository.save(user);
        return user;
    }

    public async setAvatar(id, buffer, extname) {
        const fs = require('fs').promises;
        const path = require('path');
        const lastimage = await this.getPathImage(id);
        if (lastimage != null) {
            fs.unlink(lastimage);
        }
        const imagePath = path.join(__dirname, '..', '..', '..', 'images', `${id}${extname}`);
        try {
            await fs.access(path.dirname(imagePath));
        } catch (error) {
            await fs.mkdir(path.dirname(imagePath), { recursive: true });
        }
        try {
        await fs.writeFile(imagePath, buffer);
            console.log(id + ' image updated');
            return imagePath;
        } catch (error) {
            return null;
        }
    }

    public async isfriendReq(id: string, friend_id: string) {
        var user = await this.userRepository.findOneBy({id : id});
        var friend = await this.userRepository.findOneBy({id : friend_id});
        if (user == null || friend == null) {
            return false;
        }
        if (user == friend) {
            return false;
        }
        return this.isfriend(user, friend);
    }

    public async getMpChannels(id: string) {
        const channels = await this.getChannels(id);
        if (channels == null) {
            return null;
        }
        return channels.filter((channel) => channel.type == Type.MP_CHANNEL);
    }
}