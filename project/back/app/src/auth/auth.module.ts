import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtIsAuthStrategy, JwtStrategy } from './strategy';
import { UserModule } from 'src/user/user.module';

// import { Token } from './token.entity';

@Module({
  // imports:[TypeOrmModule.forFeature([User]), ConfigModule],
  // imports: [TypeOrmModule.forFeature([User]), JwtModule.register({}), ConfigModule, TypeOrmModule.forFeature([Token])],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    ConfigModule,
  ],
  providers: [
    AuthService,
    UserService,
    JwtService,
    ConfigService,
    JwtStrategy,
    JwtIsAuthStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
