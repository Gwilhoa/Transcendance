import {
  Body,
  Controller,
  Get,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
// import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard, JwtIsAuthGuard } from './guard/jwt.guard';
import { GetUser } from './decorator/auth.decorator';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { UserStatus } from '../utils/user.enum';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get('login')
  redirectLogin(@Res() res) {
    res.redirect(
      'https://api.intra.42.fr/oauth/authorize?client_id=' +
        process.env.APP_ID +
        '&redirect_uri=' +
        process.env.APP_REDIRECT_URI +
        '&response_type=code',
    );
  }

  @Get('callback')
  async getLogin(@Query() id, @Res() res, @Body() body) {
    if (id.code == null) {
      res.status(400).send('Bad Request');
    }

    const user = await this.userService.createUsers(id.code);
    if (user == null) {
      res.status(400).send('Bad User');
      return;
    }
    const code = await this.userService.signJwtToken(user.id, false);
    res.redirect('http://localhost:8080/authenticate?access_token=' + code.access_token);
    return;
  }

  @UseGuards(JwtIsAuthGuard)
  @Get('2fa/create')
  async create2fa(@GetUser() user, @Res() res) {
    if (user.enabled2FA != true) {
      res.status(400).send('Bad Request : You already have a two factor authentication enabled');
      return;
    }
    const secret = await authenticator.generateSecret();

    const otpauthUrl = await authenticator.keyuri(
      user.email,
      'Transcendence',
      secret,
    ); // TODO : check if it can return an erreur

    await await this.userService.set2FASecret(secret, user.sub);
    res.redirect(await toDataURL(otpauthUrl));
    // return {
    //   secret,
    //   otpauthUrl
    // }
  }

  @UseGuards(JwtIsAuthGuard)
  @Get('2fa/enable')
  async turnOn2FA(@GetUser('sub') id, @Res() res) {
    const user = await this.userService.getUserById(id);
    if (user == null) {
      res.status(400).send('Bad User');
      return;
    }
    if (user.secret2FA == null) {
      res.status(400).send('Bad Request : You need to create a two factor authentication secret first');
      return;
    }
    const code2FA = '278'; // TODO : tmp
    const isValid: boolean = await this.authService.verify2FA(
      user.secret2FA,
      code2FA,
    ); // TODO : voir comment on recup le code

    if (!isValid) {
      res.status(400).send('Bad Request : Wrong two factor authentication code');
      return;
    }
    await this.userService.enabled2FA(id);
  }

  @UseGuards(JwtIsAuthGuard)
  @Get('2fa/is2FA')
  async is2FA(@GetUser() user) {
    return (user.is2FA);
  }

  @UseGuards(JwtAuthGuard)
  @Get('authenticate')
  async authenticate2FA(@GetUser() jwtUser, @Res() res) {
    const id = jwtUser.sub;
    const user = await this.userService.getUserById(id);
    if (user == null) {
      res.status(400).send('Bad User');
      return;
    }
    if (user.enabled2FA == true) {
      const code2FA = '278'; // TODO : tmp, voir comment on recup le code
      if (code2FA == null) {
        res.status(400).send('Bad Request : Wrong two factor authentication code');
        return;
      }
      const isValid: boolean = await this.authService.verify2FA(
        user.secret2FA,
        code2FA,
      );

      if (!isValid) {
        res.status(400).send('Bad Request : Wrong two factor authentication code');
        return;
      }
    }
    await this.userService.changeStatus(id, UserStatus.CONNECTED);
    const token = await this.userService.signJwtToken(user.id, true);
    res.send(token);
    return;
  }

  @UseGuards(JwtIsAuthGuard)
  @Get('2fa/disable')
  async turnOff2FA(@GetUser('sub') id, @Res() res) {
    const user = await this.userService.getUserById(id);
    if (user == null) {
      res.status(400).send('Bad User');
      return;
    }
    if (user.secret2FA == null) {
      res.status(400).send("Bad Request : You don't have the two factor authentication enabled");
      return;
    }
    await this.userService.disabled2FA(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@GetUser('sub') id, @Req() req, @Res() res) {
    await this.userService.changeStatus(id, UserStatus.DISCONNECTED);
    req.logout();
    res.redirect('/');
  }
}
