import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
  providers: [UserService, AuthService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
})
export class UserModule {}