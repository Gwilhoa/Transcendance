import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { Channel } from './channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [ChannelService],
  controllers: [ChannelController],
  imports: [TypeOrmModule.forFeature([Channel]), TypeOrmModule.forFeature([User])]
})
export class ChannelModule {}
