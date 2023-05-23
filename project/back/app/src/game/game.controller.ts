import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtIsAuthGuard } from 'src/auth/guard/jwt.guard';
import { CreateGameDTO } from 'src/dto/create-game.dto';
import { GameService } from './game.service';
import { GetUser } from '../auth/decorator/auth.decorator';

@UseGuards(JwtIsAuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGames(@GetUser('sub') id: string, @Res() response) {
    console.log(await this.gameService.getGames(id));
    return response.status(200).send(await this.gameService.getGames(id));
  }

  @Post()
  async createGame(@Body() body: CreateGameDTO, @Res() response) {
    return response.status(200).send(await this.gameService.createGame(body));
  }

  @Get('/id/:id')
  async getGameById(@Param('id') id: string, @Res() response) {
    return response.status(200).send(await this.gameService.getGameById(id));
  }
}
