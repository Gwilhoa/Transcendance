import {Body, Controller, Get, Param, Post, Res, UseGuards} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/auth.decorator';
import { JwtIsAuthGuard } from 'src/auth/guard/jwt.guard';
import { ChannelService } from './channel.service';

@UseGuards(JwtIsAuthGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async getChannels() {
    return await this.channelService.getChannels();
  }

  @Post('create')
  async createChannel(@Body() body, @GetUser('sub') id: string) {
    body.creator_id = id;
    return await this.channelService.createChannel(body);
  }

  @Post('join')
  async joinChannel(@Body() body, @GetUser('sub') id: string) {
    body.user_id = id;
    return await this.channelService.joinChannel(body);
  }

  @Post('leave')
  async leaveChannel(@Body() body, @GetUser('sub') id: string) {
    body.user_id = id;
    return await this.channelService.leaveChannel(body);
  }

  @Post('admin')
  async addAdmin(@Body() body, @GetUser('sub') id: string) {
    body.user_id = id;
    return await this.channelService.addAdmin(body);
  }

  @Post('ban')
  async banUser(@Body() body, @GetUser('sub') id: string) {
    body.user_id = id;
    return await this.channelService.banUser(body);
  }

  @Get('message')
  async getMessages(@Body() body, @GetUser('sub') id: string, @Res() resp) {
    let ret = null;
      ret = await this.channelService.getMessage(body.channel_id, id);
    if (ret == null) {
      resp.status(204).send('No content');
      return;
    }
    resp.status(200).send(ret);
  }

  @Post('message')
  async createMessage(@Body() body, @GetUser('sub') id: string) {
    body.user_id = id;
    return await this.channelService.sendMessage(body);
  }

  @Post('createmp')
  async createMp(@Body() body, @GetUser('sub') id: string) {
    return await this.channelService.createMPChannel(id, body.user_id);
  }

  @Get('channel/name/:name')
  async getChannelsByName(@Param('name') name: string, @Res() resp) {
    const channels = await this.channelService.getChannelsByName(name);
    if (channels == null) {
      resp.status(204).send('No content');
    }
  }
}
