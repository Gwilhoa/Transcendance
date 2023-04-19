import { Body, Controller, Get, Query, Redirect, Req, Res, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard, JwtIsAuthGuard } from './guard/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/auth.decorator';
import { authenticator, totp } from 'otplib';
import { toDataURL } from 'qrcode';
import { UserStatus } from '../utils/user.enum';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

    @Get('login')
    redirectLogin(@Res() res) {
      res.redirect('https://api.intra.42.fr/oauth/authorize?client_id=' + process.env.APP_ID + '&redirect_uri=' + process.env.APP_REDIRECT_URI + '&response_type=code');
    }
    

    @Get('callback')
    async getLogin(@Query() id, @Res() res, @Body() body) {
      if (id.code == null) {
        res.status(400).send('Bad Request');
      }
      // console.log(id.code);
      
      var user = await this.userService.createUsers(id.code);
      if (user == null) {
        res.status(400).send('Bad Request');
        return;
      }
      var code = await this.authService.signJwtToken(parseInt(user.id), false);
      res.redirect('http://localhost:8080/auth?access_token=' + code.acess_token);
      // var code = await this.authService.signJwtToken(parseInt(user.id), user.email);
      // res.redirect('http://localhost:8080/auth?access_token=' + code.acess_token);
      return;
      // res.redirect('http://localhost:3000?code=' + await this.authService.signJwtToken(parseInt(user.id), user.email));
      // res.redirect('https://intra.42.fr?code=comingSoon');
      // res.redirect('https://intra.42.fr');
      //res.status(200).send('OK');
      //return id;
    }

    
    // TODO : change authenticator

    @UseGuards(JwtIsAuthGuard)
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

    @UseGuards(JwtIsAuthGuard)
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
    @Get('authenticate')
    async authenticate2FA(@GetUser() jwtUser, @Res() res) {
      var id = jwtUser.sub;
      var user = await this.userService.getUserById(id);
      if (user.enable2FA != null) {
        var code2FA = '278'; // TODO : tmp, voir comment on recup le code
        if (code2FA == null)
          throw new UnauthorizedException('Wrong two factor authentication code')
        const isValid: boolean = await this.authService.verify2FA(user.secret2FA, code2FA)
        
        if (!isValid)
          throw new UnauthorizedException('Wrong two factor authentication code');
        // res.redirect('http://localhost:8080/auth?access_token=' + await this.authService.signJwtToken(parseInt(user.id), true)); //TODO : expire the old one
        // return;
      }
      await this.userService.changeStatus(id, UserStatus.CONNECTED);
      res.redirect('http://localhost:8080/auth?access_token=' + await this.authService.signJwtToken(parseInt(user.id), true));
      // TODO : return current jwt token
        // throw new UnauthorizedException('no active two factor authentication')
    }
    
    // https://dev.to/hahnmatthieu/2fa-with-nestjs-passeport-using-google-authenticator-1l32
    @UseGuards(JwtIsAuthGuard) // TODO : +2FA guard
    @Get('2fa/disable')
    async turnOff2FA(@GetUser('sub') id) {
      var user = await this.userService.getUserById(id);
      if (user.secret2FA == null)
        throw new UnauthorizedException("You don't have the two factor authentication enabled");
      await this.userService.disabled2FA(id);
    }
    
    @UseGuards(JwtAuthGuard) // TODO : +2FA guard
    @Get('logout')
    async logout(@GetUser('sub') id, @Req() req, @Res() res) { // TODO : voir pour les 2 token
      await this.userService.changeStatus(id, UserStatus.DISCONNECTED);
      req.logout();
      res.redirect('/');
    }
}

