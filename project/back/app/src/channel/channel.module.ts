import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { Channel } from './channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ChannelService],
  controllers: [ChannelController],
  imports: [TypeOrmModule.forFeature([Channel])]
})
export class ChannelModule {}
