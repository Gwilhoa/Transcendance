import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { UserStatus } from '../../utils/user.enum';

@Injectable()
export class JwtIsAuthStrategy extends PassportStrategy(Strategy, 'jwtIsAuth') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('second jwt');
    const user = await this.userService.getUserById(payload.sub);
    if (user == null) return null;
    console.log('ok user');
    if (user.status == UserStatus.DISCONNECTED) return null;
    console.log('ok status');
    // if (!user.enabled2FA)
    //     return payload;
    // if (payload.is2FA)
    //     return payload;
    if (payload.isauth) return payload;
    console.log('erreur isauth');
    // else user hasn't two authenticated so return null
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('first jwt');
    const user = await this.userService.getUserById(payload.sub);
    if (user == null) return null;
    console.log('ok user');
    if (
      user.status == UserStatus.IN_CONNECTION ||
      user.status == UserStatus.CONNECTED
    )
      return payload;
    console.log('erreur status:' + user.status);
    return null;
  }
}
