import { Body, Controller, Get, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt.guard';
import { GetUser } from './decorator/auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { authenticator, totp } from 'otplib';
import { toDataURL } from 'qrcode';


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
      var code = await this.authService.signJwtToken(parseInt(user.id), user.email);
      res.redirect('http://localhost:3000/auth?access_token=' + code.acess_token);
      return;
    }

    @UseGuards(JwtAuthGuard)
    @Get('2fa/create')
    async create2fa(@GetUser() user ,@Res() res) {
      const secret = authenticator.generateSecret(); // TODO : check if await is needed

      const otpauthUrl = authenticator.keyuri(user.email, 'Transcendence', secret); // TODO : check if await is needed
  
      await await this.userService.set2FASecret(secret, user.sub);
      res.redirect(await toDataURL(otpauthUrl));
      // return {
      //   secret,
      //   otpauthUrl
      // }
    }
    // https://dev.to/hahnmatthieu/2fa-with-nestjs-passeport-using-google-authenticator-1l32

    // @UseGuards(JwtAuthGuard)
    // @Post('logout')
    // async logout(@Req() req: Request, @Res() res: Response) {
    //   req.logout();
    //   res.redirect('/');
    // }
}

