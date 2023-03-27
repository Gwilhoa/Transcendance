import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserController } from '../user/user.controller';
import { UserModule } from '../user/user.module';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[JwtModule.register({})],
  // imports: [UserModule],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, UserService],
  controllers: [AuthController, UserController],
})
export class AuthModule {}
