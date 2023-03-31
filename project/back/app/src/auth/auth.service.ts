import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Token } from './token.entity';


@Injectable()
export class AuthService {
    constructor(private jwt: JwtService, private config: ConfigService, private tokenRepository: Repository<Token>) {}

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

    public async getIntraToken(code): Promise<any> {
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
            //return this.signJwtToken(response.data.user_id, response.data.email);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async signJwtToken(userId: number, email: string): Promise<{acess_token: string}> {
        const payload = { sub: userId, email };
        console.log(process.env.JWT_SECRET);
        
        return {
            acess_token: await this.jwt.signAsync(payload, { expiresIn: '2h', secret: process.env.JWT_SECRET})
        };
    }
    // async checkJwtToken(token: string): Promise<any> {
    // async deleteJwtToken(token: string): Promise<any> {
    // async addJwtToken(token: string): Promise<any> {
}
