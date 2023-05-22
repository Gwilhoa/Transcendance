import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {Res, Req} from '@nestjs/common';
import { JwtIsAuthGuard } from './guard/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtIsAuthGuard)
  @Get('addbot')
  async addbot(@Res() res)
  {
    this.appService.addbot();
  }

  // @UseGuards(JwtIsAuthGuard)
  // @Get('addfriends')
  // async addfriend(@Res() res)
  // {
  //   this.appService.addfriend();
  // }

  // @UseGuards(JwtIsAuthGuard)
  // @Get('addgame')
  // {
  //   this.appService.addgame();
  // }
}
