import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
}
