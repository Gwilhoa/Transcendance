import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('login')
    getLogin(@Query() id, @Res() res) : string {
      if (id.code == null) {
        res.status(400).send('Bad Request');
      }
      this.userService.createUsers(id.code);
      res.redirect('https://profile.intra.42.fr/oauth/applications/12988');
      return id;
    }
}

