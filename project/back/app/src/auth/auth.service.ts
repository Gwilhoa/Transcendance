import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { UserService } from '../user/user.service';

// import { Token } from './token.entity';

@Injectable()
export class AuthService {
  // constructor(private jwt: JwtService, private config: ConfigService, private tokenRepository: Repository<Token>) {}
  // constructor(private readonly userService: UserService, private jwt: JwtService) {}
  constructor(private jwt: JwtService) {}

  public async getUserIntra(token) {
    const axios = require('axios');
    const url = 'https://api.intra.42.fr/v2/me';
    const data = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      const response = await axios.get(url, data);
      return response.data;
    } catch (error) {
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
      redirect_uri: appRedirect,
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

  public async signJwtToken(
    userId: string,
    isauth: boolean,
  ): Promise<{ access_token: string }> {
    let expiresTime = '10m';
    if (isauth == true) expiresTime = '2h';
    // const payload = { sub: parseInt(userId), isauth: isauth ,enabled2FA: this.userService.check2FAenabled(userId)};
    const payload = { sub: parseInt(userId), isauth: isauth ,enabled2FA: 1};
    console.log(process.env.JWT_SECRET);

    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: expiresTime,
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  getIdFromToken(token: string) {
    const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET });
    return payload.sub;
  }

  public async verify2FA(secret2FA: string, code2FA: string): Promise<boolean> {
    return authenticator.verify({
      token: code2FA,
      secret: secret2FA,
    });
  }
}
