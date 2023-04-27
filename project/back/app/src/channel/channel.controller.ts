import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/auth.decorator';
import { JwtIsAuthGuard } from 'src/auth/guard/jwt.guard';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { response } from 'express';
import { JoinChannelDto } from '../dto/join-channel.dto';
import { LeaveChannelDto } from '../dto/leave-channel.dto';
import { addAdminDto } from '../dto/add-admin.dto';
import { BanUserDto } from '../dto/ban-user.dto';
import { GetMessageDto } from '../dto/get-message.dto';
import {sendMessageDTO} from "../dto/sendmessage.dto";

@UseGuards(JwtIsAuthGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async getChannels() {
    return await this.channelService.getChannels();
  }

  @Post('create')
  async createChannel(
    @Body() body: CreateChannelDto,
    @GetUser('sub') id: string,
    @Res() response,
  ) {
    let ret;
    try {
      ret = await this.channelService.createChannel(body);
    } catch (e) {
      response.status(400).send(e.message);
      return;
    }
    response.status(201).send(ret);
    return;
  }

  @Post('join')
  async joinChannel(
    @Body() body: JoinChannelDto,
    @GetUser('sub') id: string,
    @Res() response,
  ) {
    let ret;
    try {
      ret = await this.channelService.joinChannel(body);
    } catch (e) {
      response.status(400).send(e.message);
      return;
    }
    response.status(201).send(ret);
  }

  @Post('leave')
  async leaveChannel(
    @Body() body: LeaveChannelDto,
    @GetUser('sub') user_id: string,
    @Res() response,
  ) {
    let ret;
    try {
      ret = await this.channelService.leaveChannel(user_id, body.channel_id);
    } catch (e) {
      response.status(400).send(e.message);
      return;
    }
    response.status(200).send(ret);
  }

  @Post('admin')
  async addAdmin(
    @Body() body: addAdminDto,
    @GetUser('sub') id: string,
    @Res() response,
  ) {
    let ret;
    try {
      ret = await this.channelService.addAdmin(body, id);
    } catch (e) {
      response.status(400).send(e.message);
      return;
    }
    response.status(200).send(ret);
    return;
  }

  @Post('ban')
  async banUser(@Body() body: BanUserDto, @GetUser('sub') id: string) {
    let ret;
    try {
      ret = await this.channelService.banUser(body, id);
    } catch (e) {
      response.status(400).send(e.message);
      return;
    }
    return ret;
  }

  @Get('message')
  async getMessages(
    @Body() body: GetMessageDto,
    @GetUser('sub') id: string,
    @Res() resp,
  ) {
    let ret;
    try {
      ret = await this.channelService.getMessage(body.channel_id, id);
    } catch (e) {
      resp.status(400).send(e.message);
      return;
    }
    if (ret == null) {
      resp.status(204).send('No content');
      return;
    }
    resp.status(200).send(ret);
  }

  @Post('message')
  async createMessage(
    @Body() body: sendMessageDTO,
    @GetUser('sub') id: string,
    @Res() resp,
  ) {
    let ret;
    try {
      ret = await this.channelService.sendMessage(body, id);
    } catch (e) {
      resp.status(400).send(e.message);
      return;
    }
    if (ret == null) {
      resp.status(204).send('No content');
      return;
    }
    resp.status(200).send(ret);
  }

  @Post('/mp/create')
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
