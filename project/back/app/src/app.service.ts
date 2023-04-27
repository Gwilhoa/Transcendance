import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {


  getHello(): string {
    return 'Hello World!';
  }
}
