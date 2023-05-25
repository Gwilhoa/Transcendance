import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {EventsGateway} from "../events/events.gateway";

@Module({
  providers: [UserService, AuthService, JwtService, ConfigService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), AuthModule, ConfigModule],
})
export class UserModule {}
