import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Game } from './game/game.entity';
import { User } from './user/user.entity';


@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  public async addbot() {
    let id='bot'
    const users = await this.userRepository.find({
      where: { id: Like(`%${id}%`) },
    });

    const user = new User();
    const botName = (id + (users.length + 1));
    user.id = botName;
    user.username = botName;
    user.email = botName + '@student.42lyon.fr';
    await this.userRepository.save(user);
    console.log('add bot: ' + botName);
    return user;
  }

  // public async addfriend(id: string) {
  //   const bot_id = await this.addbot().id;
  //   const user = await this.userRepository.findOneBy({ id: id });
  //   const friend = await this.userRepository.findOneBy({id : bot_id});
  //   if (user == null || friend == null) {
  //     throw new Error('User not found');
  //   }
  //   if (!user.friends) {
  //     user.friends = [];
  //   }
  //   user.friends.push(friend);
  //   await this.userRepository.save(user);
  //   // await this.userRepository.save(friend);
  //   return user;
  // }
}
