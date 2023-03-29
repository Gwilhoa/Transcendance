import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(private jwt: JwtService, private config: ConfigService) {}

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

    async signJwtToken(userId: number, email: string): Promise<string> {
        const payload = { userId: userId, email: email };
        console.log(process.env.JWT_SECRET);
        return this.jwt.signAsync(payload, { expiresIn: '2h', secret: process.env.JWT_SECRET})
    }


}
