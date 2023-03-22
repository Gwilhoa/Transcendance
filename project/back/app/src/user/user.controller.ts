import { Controller, Get, Query } from '@nestjs/common';

@Controller('user')
export class UserController {

    @Get('login')
    getTest(@Query() id) : string {
      console.log(id);
      return id;
    }
}

