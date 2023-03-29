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

    @Post('addAdmin')
    async addAdmin(@Body() body) {
        return await this.channelService.addAdmin(body);
    }

    @Post('removeAdmin')
    async removeAdmin(@Body() body) {
        return await this.channelService.removeAdmin(body);
    }

}
