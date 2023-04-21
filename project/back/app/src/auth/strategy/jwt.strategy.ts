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
    const user = await this.userService.getUserById(payload.sub);
    if (user.status == UserStatus.DISCONNECTED) return null;
    // if (!user.enable2FA)
    //     return payload;
    // if (payload.is2FA)
    //     return payload;
    if (payload.isauth) return payload;
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
    return payload;
  }
}
