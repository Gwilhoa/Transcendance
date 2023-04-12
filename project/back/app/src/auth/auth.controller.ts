import { Body, Controller, Get, Query, Redirect, Req, Res, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/auth.decorator';
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
      // res.redirect('http://localhost:6200?code=' + await this.authService.signJwtToken(parseInt(user.id), user.email));
      // res.redirect('https://intra.42.fr?code=comingSoon');
      // res.redirect('https://intra.42.fr');
      //res.status(200).send('OK');
      //return id;
    }

    // TODO : change authenticator

    @UseGuards(JwtAuthGuard)
    @Get('2fa/create')
    async create2fa(@GetUser() user ,@Res() res) {
      if (user.enable2FA != true)
        throw new UnauthorizedException('You already have a two factor authentication enabled')
      const secret = authenticator.generateSecret(); // TODO : check if await is needed

      const otpauthUrl = authenticator.keyuri(user.email, 'Transcendence', secret); // TODO : check if await is needed

      await await this.userService.set2FASecret(secret, user.sub);
      res.redirect(await toDataURL(otpauthUrl));
      // return {
      //   secret,
      //   otpauthUrl
      // }
    }

    @UseGuards(JwtAuthGuard)
    @Get('2fa/enable')
    async turnOn2FA(@GetUser('sub') id) {
      var user = await this.userService.getUserById(id);
      if (user.secret2FA == null)
        throw new UnauthorizedException('You need to create a two factor authentication secret first')
      var code2FA = '278'; // TODO : tmp
      const isValid: boolean = await this.authService.verify2FA(user.secret2FA, code2FA) // TODO : voir comment on recup le code

      if (!isValid)
        throw new UnauthorizedException('Wrong two factor authentication code')
      await this.userService.enabled2FA(id)
    }

    
    // @UseGuards(JwtAuthGuard)
    // @Get('2fa/turnOff')
    
    @UseGuards(JwtAuthGuard)
    @Get('2fa/authenticate')
    async authenticate2FA(@GetUser('sub') id) {
      var user = await this.userService.getUserById(id);
      if (user.enable2FA == null)
      throw new UnauthorizedException('no active two factor authentication')
      var code2FA = '278'; // TODO : tmp
      const isValid: boolean = await this.authService.verify2FA(user.secret2FA, code2FA) // TODO : voir comment on recup le code
      
      if (!isValid)
      throw new UnauthorizedException('Wrong two factor authentication code');
      // await this.authService.loginWith2fa(id) // TODO
    }
    
    // https://dev.to/hahnmatthieu/2fa-with-nestjs-passeport-using-google-authenticator-1l32
    @UseGuards(JwtAuthGuard) // TODO : +2FA guard
    @Get('2fa/disable')
    async turnOff2FA(@GetUser('sub') id) {
      var user = await this.userService.getUserById(id);
      if (user.secret2FA == null)
        throw new UnauthorizedException("You don't have the two factor authentication enabled");
      await this.userService.disabled2FA(id);
    }
    
    @UseGuards(JwtAuthGuard) // TODO : +2FA guard
    @Post('logout')
    async logout(@Req() req, @Res() res) {
      req.logout();
      res.redirect('/');
    }
}

