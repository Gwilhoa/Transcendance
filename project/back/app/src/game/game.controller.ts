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
  getGames(@GetUser('sub') id: string, @Res() response) {
    return response.status(200).send(this.gameService.getGames(id));
  }

  @Post()
  createGame(@Body() body: CreateGameDTO, @Res() response) {
    return response.status(200).send(this.gameService.createGame(body));
  }

  @Get('/id/:id')
  getGameById(@Param('id') id: string, @Res() response) {
    return response.status(200).send(this.gameService.getGameById(id));
  }
}
