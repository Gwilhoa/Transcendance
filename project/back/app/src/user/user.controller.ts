import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtIsAuthGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator/auth.decorator';
import * as path from 'path';
import * as fs from 'fs';
import { extname } from 'path';
import { promisify } from 'util';
import fetch from 'node-fetch';

@UseGuards(JwtIsAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get('/id')
  async findOne(@GetUser('sub') id: string, @Res() response): Promise<User> {
    const ret = await this.userService.getUserById(id);
    if (ret == null) {
      response.status(204).send('No Content');
      return;
    }
    response.status(200).send(ret);
    return;
  }

  @Get('/id/:id')
  async findOneById(@Param('id') iduser: string, @Res() response) {
    const ret = await this.userService.getUserById(iduser);
    if (ret == null) {
      response.status(204).send('No Content');
      return;
    }
    response.status(200).send(ret);
    return;
  }

  @Get('/image')
  async getImage(@GetUser('sub') id: string, @Res() response) {
    let imagePath;
    try {
      imagePath = await this.userService.getImageById(id);
    } catch (e) {
      const request = await fetch(
        'https://cdn.bitume2000.fr/achievement/0.png',
      );
      const buffer = await request.buffer();
      fs.mkdirSync(__dirname + '/../../../images', { recursive: true });
      await this.userService.setAvatar(id, buffer, '.png');
      imagePath = await this.userService.getImageById(id);
    }
    try {
      const asyncReadFile = promisify(fs.readFile);
      const image = await asyncReadFile(imagePath);
      const fileExt = path.extname(imagePath).substr(1);
      const base64Image = image.toString('base64');
      const dataUri = `data:image/${fileExt};base64,${base64Image}`;
      response.setHeader('Content-Type', `image/${fileExt}`);
      response.status(200).send(dataUri);
    } catch (error) {
      response.status(500).send('Internal Server Error');
    }
  }

  @Get('/image/:id')
  async getImageById(@Param() id: string, @Res() response) {
    let imagePath;
    try {
      imagePath = await this.userService.getImageById(id);
    } catch (e) {
      return response.status(404).send(e.message);
    }

    try {
      const asyncReadFile = promisify(fs.readFile);
      const image = await asyncReadFile(imagePath);
      const fileExt = path.extname(imagePath).substr(1);
      const base64Image = image.toString('base64');
      const dataUri = `data:image/${fileExt};base64,${base64Image}`;
      response.setHeader('Content-Type', `image/${fileExt}`);
      response.status(200).send(dataUri);
    } catch (error) {
      response.status(500).send('Internal Server Error');
    }
  }

  @Post('/image')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname);
        if (
          ext !== '.jpg' &&
          ext !== '.jpeg' &&
          ext !== '.png' &&
          ext !== '.gif'
        ) {
          return callback(
            new HttpException(
              'Only images are allowed',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async setImage(
    @GetUser('sub') id: string,
    @Res() response,
    @UploadedFile() file,
  ) {
    const ret = await this.userService.setAvatar(
      id,
      file.buffer,
      extname(file.originalname),
    );
    if (ret == null) {
      response.send('Error while uploading image').status(400);
      return;
    }
    response.status(200).send(ret);
  }

  @Post('/friend')
  async addFriend(
    @GetUser('sub') id: string,
    @Body('friend_id') friend_id: string,
    @Res() response,
  ) {
    let ret;
    try {
      ret = await this.userService.addFriend(friend_id, id);
    } catch (e) {
      response.status(400).send('Bad Request ' + e);
      return;
    }
    if (ret == null) {
      response.status(201).send('Friend Request Sent');
    }
    response.status(200).send(ret);
  }

  @Get('/friend')
  async getFriends(@GetUser('sub') id: string, @Res() response) {
    const ret = await this.userService.getFriends(id);
    if (ret == null) {
      response.status(204).send('No Friends');
      return;
    }
    response.status(200).send(ret);
  }

  @Get('/friend/request')
  async getFriendRequests(@GetUser('sub') id: string, @Res() response) {
    const ret = await this.userService.getFriendRequests(id);
    if (ret == null) {
      response.status(204).send('No Friend Requests');
      return;
    }
    response.status(200).send(ret);
    return;
  }

  @Post('/friend/blocked')
  async addBlocked(
    @GetUser('sub') id: string,
    @Body('blocked_id') blocked_id: string,
    @Res() response,
  ) {
    let ret;
    try {
      ret = await this.userService.addBlocked(id, blocked_id);
    } catch (e) {
      response.status(400).send('Bad Request ' + e);
      return;
    }
    response.status(200).send(ret);
  }

  @Get('/friend/blocked')
  async getBlocked(@GetUser('sub') id: string, @Res() response) {
    const ret = await this.userService.getBlocked(id);
    if (ret == null) {
      response.status(204).send('No Blocked');
      return;
    }
    response.status(200).send(ret);
  }

  @Delete('/friend/blocked')
  async removeBlocked(
    @GetUser('sub') id: string,
    @Body('blocked_id') blocked_id: string,
    @Res() response,
  ) {
    try {
      await this.userService.removeBlocked(id, blocked_id);
    } catch (e) {
      response.status(400).send('Bad Request ' + e);
      return;
    }
    response.status(200).send('user unblocked');
  }

  @Post('/name')
  async setName(
    @GetUser('sub') id: string,
    @Body('name') name: string,
    @Res() response,
  ) {
    const ret = await this.userService.setName(id, name);
    if (ret == null) {
      response.status(204).send('No Content');
      return;
    }
    response.status(200).send(ret);
  }

  @Get('isfriend')
  async isFriend(
    @GetUser('sub') id: string,
    @Body('friend_id') friend_id: string,
    @Res() response,
  ) {
    let ret;
    try {
      ret = await this.userService.isfriendRoute(id, friend_id);
    } catch (e) {
      response.status(400).send('Bad Request ' + e);
      return;
    }
    response.status(200).send(ret);
  }

  @Get('/mpchannel')
  async getMpChannel(@GetUser('sub') id: string, @Res() response) {
    const ret = await this.userService.getMpChannels(id);
    if (ret == null) {
      response.status(204).send('No Channel');
      return;
    }
    response.status(200).send(ret);
    return;
  }

  @Get('/games')
  async getGames(@GetUser('sub') id: string, @Res() response) {
    const ret = await this.userService.getGames(id);
    if (ret == null) {
      response.status(204).send('No Games');
      return;
    }
    response.status(200).send(ret);
    return;
  }
}
