import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game/game.entity';
import { User } from './user/user.entity';


@Injectable()
export class AppService {
  @InjectRepository(User) private userRepository: Repository<User>,
  @InjectRepository(Game) private gameRepository: Repository<Game>,
  getHello(): string {
    return 'Hello World!';
  }

  // public async test() {
  //   const users = await this.userRepository.find();
  //   const user = new User();
  //   user.id = '1';
  //   user.username = 'test';
  //   user.email = 'test@student.42lyon.fr';
  //   await this.userRepository.save(user);
  //   return user;
  // }
}
