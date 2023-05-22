import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {Res, Req} from '@nestjs/common'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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
