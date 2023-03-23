import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user';

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
        const axios = require('axios');
        const url = 'https://api.intra.42.fr/oauth/token';
        const data = {
            client_id: 'u-s4t2ud-429c6fba8f8262b957353e8b23183e7cbc8e353150e050c06d540c0a8e84677a',
            client_secret: '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',
            grant_type: 'authorization_code',
            code: code,
            redirect_uri : 'http://localhost:6200/user/login'
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
        console.log(retIntra);
        if (retIntra == null) {
            return null;
        }
        const retUser = await this.getUserIntra(retIntra.access_token);
        console.log(retUser);
    }
}
