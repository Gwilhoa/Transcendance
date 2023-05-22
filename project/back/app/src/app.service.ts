import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Game } from './game/game.entity';
import { User } from './user/user.entity';


@Injectable()
export class AppService {
  @InjectRepository(User) private userRepository: Repository<User>,
  @InjectRepository(Game) private gameRepository: Repository<Game>,
  getHello(): string {
    return 'Hello World!';
  }

  public async addbot() {
    let id='bot'
    const users = await this.userRepository.find({
      where: { id: Like(`%${id}%`) },
    });
    const user = new User();
    user.id = id + users.length + 1;
    user.username = id + users.length + 1;
    user.email = id + users.length + 1 + '@student.42lyon.fr';
    await this.userRepository.save(user);
    console.log('add bot: ' + id + users.length + 1);
    return user;
  }
}
