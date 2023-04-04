import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ChannelService } from './channel.service';

@UseGuards(JwtAuthGuard)
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
    async getMessages(@Body() body, @GetUser('sub') id: string) {
        return await this.channelService.getMessage(body.channel_id);
    }

    @Post('message')
    async createMessage(@Body() body, @GetUser('sub') id: string) {
        body.user_id = id;
        return await this.channelService.sendMessage(body);
    }

}
