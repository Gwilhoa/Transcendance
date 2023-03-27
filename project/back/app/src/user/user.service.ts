import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import fetch from 'node-fetch';


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, private authService: AuthService) {}

    public async createUsers(code) {
        const retIntra =  await this.authService.getToken(code);
        if (retIntra == null) {
            return null;
        }
        const retUser = await this.authService.getUserIntra(retIntra.access_token);
        console.log(retUser.id);
        console.log(retUser.login);
        console.log(retUser.image.link);
        const user = new User();
        user.id = retUser.id;
        user.username = retUser.login;
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
            return null;
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
            return null;
        }
        user.friends.push(friend);
        await this.userRepository.save(user);
        return user;
    }

    public async getFriends(id: string) {
        var user = await this.userRepository.findOneBy({id : id});
        if (user == null) {
            return null;
        }
        return user.friends;
    }
}