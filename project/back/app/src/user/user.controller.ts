import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common';
import {User} from './user.entity';
import {UserService} from './user.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {JwtIsAuthGuard} from '../auth/guard/jwt.guard';
import {GetUser} from '../auth/decorator/auth.decorator';
import {extname} from 'path';

@UseGuards(JwtIsAuthGuard)
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {
	}


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
		const fs = require('fs');
		const path = require('path');
		const imagePath = await this.userService.getPathImage(id);
		console.log(imagePath);
		if (imagePath == null) {
			response.status(404).send('Image not found');
			return;
		}
		const stream = fs.createReadStream(imagePath);
		const fileExt = path.extname(imagePath).substr(1);
		response.setHeader('Content-Type', 'image/' + fileExt);
		stream.on('error', (error) => {
			response.status(500).send('Cannot read file');
		});
		stream.pipe(response);
	}

	@Post('/image')
	@UseInterceptors(FileInterceptor('image', {
		fileFilter: (req, file, callback) => {
			const ext = extname(file.originalname);
			if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.gif') {
				return callback(new HttpException('Only images are allowed', HttpStatus.BAD_REQUEST), false);
			}
			callback(null, true);
		},
	}))
	async setImage(
		@GetUser('sub') id: string,
		@Res() response,
		@UploadedFile() file,
	) {
		const ret = await this.userService.setAvatar(id, file.buffer, extname(file.originalname));
		if (ret == null) {
			response.send('Error while uploading image').status(400);
			return;
		}
		response.status(200).send(ret);
	}

	@Post('/friend')
	async addFriend(@GetUser('sub') id: string, @Body('friend_id') friend_id: string, @Res() response) {
		try {
			var ret = await this.userService.addFriend(id, friend_id);
			await this.userService.addFriend(friend_id, id);
		} catch (e) {
			response.status(400).send('Bad Request ' + e);
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
			response.status(400).send('Bad Request ' + e);
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

	@Post('/name')
	async setName(@GetUser('sub') id: string, @Body('name') name: string, @Res() response) {
		var ret = await this.userService.setName(id, name);
		if (ret == null) {
			response.status(204).send('No Content');
			return;
		}
		response.status(200).send(ret);
	}

	@Get('isfriend')
	async isFriend(@GetUser('sub') id: string, @Body('friend_id') friend_id: string, @Res() response) {
		var ret = await this.userService.isfriendReq(id, friend_id);
		if (ret == null) {
			response.status(204).send('No Content');
			return;
		}
		response.status(200).send(ret);
	}

	@Get('/mpchannel')
	async getMpChannel(@GetUser('sub') id: string, @Res() response) {
		var ret = await this.userService.getMpChannels(id);
		if (ret == null) {
			response.status(204).send('No Channel');
			return;
		}
		response.status(200).send(ret);
		return;
	}
}
