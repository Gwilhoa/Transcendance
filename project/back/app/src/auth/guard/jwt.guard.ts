
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
@Injectable()
export class Jwt2FAAuthGuard extends AuthGuard('jwt2FA') {}
