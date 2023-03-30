import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserController } from '../user/user.controller';
import { UserModule } from '../user/user.module';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy';

@Module({
  // imports:[TypeOrmModule.forFeature([User]), ConfigModule],
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({}), ConfigModule],
  providers: [AuthService, UserService, JwtService, ConfigService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
