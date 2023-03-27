import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get('/id/:id')
  async findOne(@Param('id') id: string, @Res() response): Promise<User> {
    var ret = await this.userService.getUserById(id);
    if (ret == null) {
      response.status(204).send('No Content');
    }
    return this.userService.getUserById(id);
  }

  @Get('/image/:id')
  async getImage(@Param('id') id: string, @Res() response) {
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

  @Post('/image/:id')
  @UseInterceptors(FileInterceptor('image'))
  async setImage(@Param('id') id: string, @Res() response, @UploadedFile() file) {
    const path = await this.userService.getImageById(id);
    if (path == null) {
      response.status(204).send('No Content');
    } else {
      const fs = require('fs');
      fs.writeFile(path, file.buffer, (err) => {
        if (err) {
          response.status(500).send('Cannot write file');
        }
        console.log('Image downloaded successfully!');
        response.status(200).send('OK');
      });
    }
  }

  @Post('/friend/:id')
  async addFriend(@Param('id') id: string, @Body('friend_id') friend_id: string, @Res() response) {
    var ret = await this.userService.addFriend(id, friend_id);
    if (ret == null) {
      response.status(204).send('No Content');
    }
    return ret;
  }

  @Get('/friend/:id')
  async getFriends(@Param('id') id: string, @Res() response) {
    var ret = await this.userService.getFriends(id);
    if (ret == null) {
      response.status(204).send('No Content');
    }
    return ret;
  }
}