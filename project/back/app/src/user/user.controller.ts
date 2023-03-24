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
      res.redirect('https://intra.42.fr');
      return id;
    }

    @Get()
    getUsers() {
      return this.userService.getUsers();
    }
}

