import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @Get()
    async getChannels() {
        return await this.channelService.getChannels();
    }

    @Post('create')
    async createChannel(@Body() body) {
        return await this.channelService.createChannel(body);
    }

    @Post('join')
    async joinChannel(@Body() body) {
        return await this.channelService.joinChannel(body);
    }

    @Post('leave')
    async leaveChannel(@Body() body) {
        return await this.channelService.leaveChannel(body);
    }

    @Post('admin')
    async addAdmin(@Body() body) {
        return await this.channelService.addAdmin(body);
    }

    @Post('ban')
    async banUser(@Body() body) {
        return await this.channelService.banUser(body);
    }

    @Get('message')
    async getMessages(@Body() body) {
        return await this.channelService.getMessage(body.channel_id);
    }

    @Post('message')
    async createMessage(@Body() body) {
        return await this.channelService.sendMessage(body);
    }

}
