import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtIsAuthGuard } from 'src/auth/guard/jwt.guard';
import { CreateGameDTO } from 'src/dto/create-game.dto';
import { GameService } from './game.service';
import { GetUser } from '../auth/decorator/auth.decorator';

@UseGuards(JwtIsAuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly GameService: GameService) {}

  @Get()
  getGames(@GetUser('sub') id: string) {
    return this.GameService.getGames(id);
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
