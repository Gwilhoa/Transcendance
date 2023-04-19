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
import { JwtStrategy, JwtIsAuthStrategy } from './strategy';
import { Type } from 'ajv/dist/compile/util';
// import { Token } from './token.entity';

@Module({
  // imports:[TypeOrmModule.forFeature([User]), ConfigModule],
  // imports: [TypeOrmModule.forFeature([User]), JwtModule.register({}), ConfigModule, TypeOrmModule.forFeature([Token])],
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({}), ConfigModule],
  providers: [AuthService, UserService, JwtService, ConfigService, JwtStrategy, JwtIsAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
