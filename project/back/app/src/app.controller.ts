import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtIsAuthGuard } from './auth/guard/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('addbot')
  async addbot(@Res() res) {
    this.appService.addbot();
    return res.status(400).send('ok');
  }

  @Get('addfriend/:id')
  async addfriend(@Res() res, @Param('id') id) {
    try {
      this.appService.addfriend(id);
    } catch (e) {
      return res.status(400).send('Bad User');
    }
    return res.status(200).send('ok');
  }

  @Get('addgame/:id')
  async addgame(@Res() res, @Param('id') id) {
    try {
      this.appService.addgame(id);
    } catch (e) {
      return res.status(400).send('Bad User');
    }
    return res.status(200).send('ok');
  }
}
