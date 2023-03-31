import { Body, Controller, Get, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

    @Get('login')
    redirectLogin(@Res() res) {
      res.redirect('https://api.intra.42.fr/oauth/authorize?client_id=' + process.env.APP_ID + '&redirect_uri=' + process.env.APP_REDIRECT_URI + '&response_type=code');
    }
    

    @Get('login/token')
    async getLogin(@Query() id, @Res() res, @Body() body) {
      if (id.code == null) {
        res.status(400).send('Bad Request');
      }
      var user = await this.userService.createUsers(id.code);
      // if (user != null && user.secret2FA != null) {
      //   twofactor.verifyToken("XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W", body.token);
      // }

      // return (this.authService.signJwtToken(parseInt(user.id), user.email))
      // console.log("Jwt : " + await this.authService.signJwtToken(parseInt(user.id), user.email));
      res.status(200).send(await this.authService.signJwtToken(parseInt(user.id), user.email));
      return;
      // res.redirect('http://localhost:6200?code=' + await this.authService.signJwtToken(parseInt(user.id), user.email));
      // res.redirect('https://intra.42.fr?code=comingSoon');
      //res.redirect('https://intra.42.fr');
      //res.status(200).send('OK');
      //return id;
    }

    // @UseGuards(JwtAuthGuard)
    // @Get('2fa/create')
    // async create2fa(@Res() res) {
    //   const newSecret = twofactor.generateSecret({ name: "Transcendance", account: "oui" });
    //   response.status(200).send(newSecret.qr);
    //   if (verify) {
    //     // user secret 2fa = newSecret.secret;
    //   }

    // }

    // @UseGuards(JwtAuthGuard)
    // @Post('logout')
    // async logout(@Req() req: Request, @Res() res: Response) {
    //   req.logout();
    //   res.redirect('/');
    // }
}

