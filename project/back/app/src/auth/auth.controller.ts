import {
  Body,
  Controller,
  Get,
  Query,
  Req,
  Res,
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
  async getLogin(@Query() id, @Res() res) {
    if (id.code == null) {
      res.status(400).send('Bad Request');
    }

    const user = await this.userService.createUsers(id.code);
    if (user == null) {
      res.status(400).send('Bad User');
      return;
    }
    const code = await this.userService.signJwtToken(user.id, user.email, false);
    console.log("first jwt: " + code.access_token);
    res.redirect(
      'http://localhost:8080/authenticate?access_token=' + code.access_token,
    );
    return;
  }

  @UseGuards(JwtIsAuthGuard)
  @Get('2fa/create')
  async create2fa(@GetUser() user, @Res() res) {
    // if (user.enabled2FA != true) {
    //   res
    //     .status(400)
    //     .send(
    //       'Bad Request : You already have a two factor authentication enabled',
    //     );
    //   return;
    // }
    const secret = await authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.email,
      'Transcendence',
      secret,
    );

    if ((await this.userService.set2FASecret(secret, user.sub)) == null) {
      res.status(400).send('Bad Request : Error while saving secret');
      return;
    }
    res.status(200).send(await toDataURL(otpauthUrl));
    // return {
    //   secret,
    //   otpauthUrl
    // }
  }

  @UseGuards(JwtIsAuthGuard)
  @Get('2fa/enable')
  async turnOn2FA(@GetUser('sub') id, @Res() res, @Body() body) {
    const user = await this.userService.getUserById(id);
    if (user == null) {
      res.status(400).send('Bad User');
      return;
    }
    if (user.secret2FA == null) {
      res
        .status(400)
        .send(
          'Bad Request : You need to create a two factor authentication secret first',
        );
      return;
    }
    const code2FA = body.code;
    if (code2FA == null) {
      res.status(400).send('Bad Request : You need to provide a code');
      return;
    }
    const isValid: boolean = await this.authService.verify2FA(
      user.secret2FA,
      code2FA,
    );
    if (!isValid) {
      res
        .status(400)
        .send('Bad Request : Wrong two factor authentication code');
      return;
    }
    await this.userService.enabled2FA(id);
    res.status(200).send(true);
    return ;
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/is2FA')
  async is2FA(@GetUser() user, @Res() res) {
    user = await this.userService.getUserById(user.sub);
    if (user == null) {
      res.status(400).send('Bad User');
      return;
    }
    res.status(200).send(user.enabled2FA);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('authenticate') // TODO : check pourquoi ca ne marche pas une fois deux
  async authenticate2FA(@GetUser() jwtUser, @Res() res, @Body() body) {
    const id = jwtUser.sub;
    let user = await this.userService.getUserById(id);
    if (user == null) {
      res.status(400).send('Bad User');
      return;
    }
    if (user.enabled2FA == true) {
      const code2FA = body.code;
      if (code2FA == null) {
        res
          .status(400)
          .send('Bad Request : Wrong two factor authentication code');
        return;
      }
      const isValid: boolean = await this.authService.verify2FA(
        user.secret2FA,
        code2FA,
      );

      if (!isValid) {
        res
          .status(400)
          .send('Bad Request : Wrong two factor authentication code');
        return;
      }
    }
    user = await this.userService.changeStatus(id, UserStatus.CONNECTED);
    if (user == null) {
      res.status(400).send('unrecognized user');
      return;
    }
    const token = await this.userService.signJwtToken(user.id, user.email, true);
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
    if (user.enabled2FA == false) {
      res
        .status(400)
        .send(
          "Bad Request : You don't have the two factor authentication enabled",
        );
      return;
    }
    if (user.secret2FA == null) {
      res
        .status(400)
        .send(
          "Bad Request : You don't have the two factor authentication enabled",
        );
      return;
    }
    await this.userService.disabled2FA(id);
    res.status(200).send(true);
    return ;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@GetUser('sub') id, @Req() req, @Res() res) {
    if (
      (await this.userService.changeStatus(id, UserStatus.DISCONNECTED)) == null
    )
      res.status(400).send('Bad User');
    req.logout();
    res.redirect('/');
  }
}
