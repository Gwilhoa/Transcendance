import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

//   @Get()
//   async findAll(): Promise<User[]> {
//     return this.userService.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string): Promise<User> {
//     return this.userService.findOne(id);
//   }

//   @Post()
//   async create(@Body() user: User): Promise<User> {
//     return this.userService.createUsers(user);
//   }

//   @Put(':id')
//   async update(@Param('id') id: string, @Body() user: User): Promise<User> {
//     return this.userService.update(id, user);
//   }

//   @Delete(':id')
//   async delete(@Param('id') id: string): Promise<User> {
//     return this.userService.delete(id);
//   }
}