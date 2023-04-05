import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator/auth.decorator';
import { rmSync } from 'fs';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get('/id')
  async findOne(@GetUser('sub') id: string, @Res() response): Promise<User> {
    var ret = await this.userService.getUserById(id);
    if (ret == null) {
      response.status(204).send('No Content');
      return;
    }
    response.status(200).send(ret);
    return;
  }

  @Get('/id/:id')
  async findOneById(@Param('id') iduser: string, @Res() response, @GetUser('sub') ud) {
    var ret = await this.userService.getUserById(iduser);
    if (ret == null) {
      response.status(204).send('No Content');
      return;
    }
    response.status(200).send(ret);
    return;
  }
  @Get('/image')
  async getImage(@GetUser('sub') id: string, @Res() response) {
    const path = await this.userService.getImageById(id);
    if (path == null) {
      response.status(204).send('No Content');
    } else {
      const fs = require('fs');
      const stream = fs.createReadStream(path);
      stream.on('error', (error) => {
        response.status(500).send('Cannot read file');
      });
      stream.pipe(response);
    }
  }

  @Post('/image')
  @UseInterceptors(FileInterceptor('image'))
  async setImage(@GetUser('sub') id: string, @Res() response, @UploadedFile() file) {
    const path = await this.userService.getImageById(id);
    if (path == null) {
      response.status(204).send('No Content');
    } else {
      const fs = require('fs');
      if (file == null) {
        response.status(400).send('Bad Request');
        return;
      }
      fs.writeFile(path, file.buffer, (err) => {
        if (err) {
          response.status(400).send('Cannot write file');
        }
        console.log(id + ' image updated');
        response.status(200).send('OK');
      });
    }
  }

  @Post('/friend')
  async addFriend(@GetUser('sub') id: string, @Body('friend_id') friend_id: string, @Res() response) {
    try {
      var ret = await this.userService.addFriend(id, friend_id);
      await this.userService.addFriend(friend_id, id);
    } catch (e) {
      response.status(400).send('Bad Request '+ e);
      return;
    }
    response.status(200).send(ret);
  }

  @Get('/friend')
  async getFriends(@GetUser('sub') id: string, @Res() response) {
    var ret = await this.userService.getFriends(id);
    if (ret == null) {
      response.status(204).send('No Friends');
      return;
    }
    response.status(200).send(ret);
  }

  @Get('/friendrequest')
  async getFriendRequests(@GetUser('sub') id: string, @Res() response) {
    var ret = await this.userService.getFriendRequests(id);
    if (ret == null) {
      response.status(204).send('No Friend Requests');
      return;
    }
    response.status(200).send(ret);
    return;
  }

  @Post('/blocked')
  async addBlocked(@GetUser('sub') id: string, @Body('blocked_id') blocked_id: string, @Res() response) {
    try {
      var ret = await this.userService.addBlocked(id, blocked_id);
    } catch (e) {
      response.status(400).send('Bad Request '+ e);
      return;
    }
    response.status(200).send(ret);
  }

  @Get('/blocked')
  async getBlocked(@GetUser('sub') id: string, @Res() response) {
    var ret = await this.userService.getBlocked(id);
    if (ret == null) {
      response.status(204).send('No Blocked');
      return;
    }
    response.status(200).send(ret);
  }

  @Get('/channel')
  async getChannel(@GetUser('sub') id: string, @Res() response) {
    var ret = await this.userService.getChannels(id);
    if (ret == null) {
      response.status(204).send('No Channel');
      return;
    }
    response.status(200).send(ret);
    return;
  }
}