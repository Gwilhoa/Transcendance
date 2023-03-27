import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private userService: UserService) {}

    @Get('login')
    redirectLogin(@Res() res) {
      res.redirect('https://api.intra.42.fr/oauth/authorize?client_id=' + process.env.APP_ID + '&redirect_uri=' + process.env.APP_REDIRECT_URI + '&response_type=code');
    }
    

    @Get('login/token')
    getLogin(@Query() id, @Res() res) {
      if (id.code == null) {
        res.status(400).send('Bad Request');
      }
      this.userService.createUsers(id.code);
      res.redirect('http://localhost:6200/test?code=fddssdfdsf');
      //res.redirect('https://intra.42.fr');
      //res.status(200).send('OK');
      //return id;
    }

}

