import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Game, GameStatus} from './game.entity';
import {Repository} from 'typeorm';
import {UserService} from 'src/user/user.service';
import {CreateGameDTO} from 'src/dto/create-game.dto';

@Injectable()
export class GameService {
	constructor(@InjectRepository(Game) private gameRepository: Repository<Game>, private readonly userService: UserService) {
	}

	async getGames() {
		return await this.gameRepository.find();
	}

	async createGame(body: CreateGameDTO) {
		const game = new Game();
		const user1 = await this.userService.getUserById(body.user1_id);
		const user2 = await this.userService.getUserById(body.user2_id);
		game.user1 = user1;
		game.user2 = user2;
		game.score1 = 0;
		game.score2 = 0;
		game.finished = GameStatus.INGAME;
		return await this.gameRepository.save(game);
	}

	async getGameById(id: string) {
		return await this.gameRepository.findOneBy({id: id});
	}

}
