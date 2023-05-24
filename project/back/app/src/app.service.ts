import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user/user.entity';
import { Game, GameStatus } from './game/game.entity';


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

  public async addfriend(myId: string) {
    const bot = await this.addbot();
    const user = await this.userRepository.findOneBy({ id: myId });
    const friend = await this.userRepository.findOneBy({id : bot.id});
    if (user == null || friend == null) {
      throw new Error('User not found');
    }
    if (!user.friends) {
      user.friends = [];
    }
    user.friends.push(friend);
    await this.userRepository.save(user);
    await this.userRepository.save(friend);
    return user;
  }

  public async addgame(myId: string)
  {
    const bot = await this.addbot();
    const game = new Game();
    const user1 = await this.userRepository.findOneBy({ id: myId });
    const user2 = await this.userRepository.findOneBy({ id: bot.id});
    if (user1 == null || user2 == null) {
      throw new Error('User not found');
    }
    game.user1 = user1;
    game.user2 = user2;
    let randomScore = Math.floor(Math.random() * 3);
    let Winner = Math.floor(Math.random() * 2);
    if (Winner == 0){
      game.score1 = 3;
      game.score2 = randomScore;
    }
    else {
      game.score1 = randomScore;
      game.score2 = 3;
    }
    game.finished = GameStatus.FINISHED;
    return await this.gameRepository.save(game);
  }
}
