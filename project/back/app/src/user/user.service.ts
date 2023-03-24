import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    public async getUserIntra(token) {
        const axios = require('axios');
        const url = 'https://api.intra.42.fr/v2/me';
        const data = {
            headers: {
                "Authorization": "Bearer " + token
            }
        };
        try {
            const response = await axios.get(url, data);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    public async getToken(code): Promise<any> {
        const appId = process.env.APP_ID;
        const appSecret = process.env.APP_SECRET;
        const appRedirect = process.env.APP_REDIRECT_URI;
        const axios = require('axios');
        const url = 'https://api.intra.42.fr/oauth/token';
        const data = {
            client_id: appId,
            client_secret: appSecret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri : appRedirect,
        };
    
        try {
            const response = await axios.post(url, data);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    
    public async createUsers(code) {
        const retIntra =  await this.getToken(code);
        if (retIntra == null) {
            return null;
        }
        const retUser = await this.getUserIntra(retIntra.access_token);
        console.log(retUser.id);
        console.log(retUser.login);
        console.log(retUser.image.link);
        const user = new User();
        user.id = retUser.id;
        user.username = retUser.login;
        user.avatar_url = retUser.image.link;
        if (await this.userRepository.findOneBy({id : user.id}) != null) {
            return null;
        }
        await this.userRepository.save(user);
        return user;
    }

    public async getUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

}
