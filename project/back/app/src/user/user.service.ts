import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import fetch from 'node-fetch';
import { use } from 'passport';


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, private authService: AuthService) {}

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
        var fs = require('fs');
        fs.mkdirSync(__dirname+'/../../../images', { recursive: true });
        var path = __dirname+'/../../../images/' + user.id + '.jpg';
        console.log(path);
        fs.writeFile(path, buffer, (err) => {
            if (err) throw err;
            console.log('Image downloaded successfully!');
          });
        
        



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
}