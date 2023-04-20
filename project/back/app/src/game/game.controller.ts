import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {JwtIsAuthGuard} from 'src/auth/guard/jwt.guard';
import {CreateGameDTO} from 'src/dto/create-game.dto';
import {GameService} from './game.service';

@UseGuards(JwtIsAuthGuard)
@Controller('game')
export class GameController {
	constructor(private readonly GameService: GameService) {
	}

	@Get()
	getGames() {
		return this.GameService.getGames();
	}

	@Post()
	createGame(@Body() body: CreateGameDTO) {
		return this.GameService.createGame(body);
	}

	@Get('/id/:id')
	getGameById(@Param('id') id: string) {
		return this.GameService.getGameById(id);
	}
}
