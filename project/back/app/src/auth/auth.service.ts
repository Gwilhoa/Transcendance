import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor() {}

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


}
