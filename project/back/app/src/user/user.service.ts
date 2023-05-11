import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import fetch from 'node-fetch';
import { RequestFriend } from './requestfriend.entity';
import { ChannelType } from 'src/utils/channel.enum';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '../utils/user.enum';

@Injectable()
export class UserService {
  constructor(
    private jwt: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  public async getPathImage(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    const imageDir = path.join(__dirname, '..', '..', '..', 'images');
    const files = await fs.promises.readdir(imageDir);
    const matchingFiles = files.filter((file) => file.startsWith(id));
    if (matchingFiles.length == 0) {
      return null;
    }
    return path.join(imageDir, matchingFiles[0]);
  }

  public asfriendrequestby(user: User, friend: User) {
    if (user.requestsReceived == null) {
      return false;
    }
    for (let i = 0; i < user.requestsReceived.length; i++) {
      if (user.requestsReceived[i].sender.id == friend.id) {
        return true;
      }
    }
    return false;
  }

  public isfriend(user: User, friend: User) {
    if (user.friends == null) {
      return false;
    }
    for (let i = 0; i < user.friends.length; i++) {
      if (user.friends[i].id == friend.id) {
        return true;
      }
    }
    return false;
  }
  public async createUsers(code) {
    const retIntra = await this.authService.getIntraToken(code);
    if (retIntra == null) {
      return null;
    }
    await this.test();
    const retUser = await this.authService.getUserIntra(retIntra.access_token);
    if ((await this.userRepository.findOneBy({ id: retUser.id })) != null) {
      return await this.userRepository.findOneBy({ id: retUser.id });
    }
    let login = retUser.login;
    let nbr = 0;
    while (await this.userRepository.findOneBy({ username: login })) {
      login = retUser.login + nbr;
      nbr++;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const user = new User();
    user.status = UserStatus.IN_CONNECTION;
    user.id = retUser.id;
    user.username = login;
    user.email = retUser.email;
    const avatar_url = retUser.image.link;
    const request = await fetch(avatar_url);
    const buffer = await request.buffer();
    fs.mkdirSync(__dirname + '/../../../images', { recursive: true });
    const image = await this.setAvatar(user.id, buffer, '.jpg');
    if (image == null) {
      return null;
    }
    if ((await this.userRepository.findOneBy({ id: user.id })) != null) {
      return user;
    }
    await this.userRepository.save(user);
    return user;
  }

  public async getUsers() {
    return await this.userRepository.find();
  }

  public async getUserById(id: string) {
    return await this.userRepository.findOneBy({ id: id });
  }

  public async getImageById(id: string) {
    const imagePath = await this.getPathImage(id);
    if (imagePath == null) {
      throw new Error('Image not found');
    }
    return imagePath;
  }

  public async addFriend(id: string, friend_id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    const friend = await this.userRepository.findOneBy({ id: friend_id });
    if (user == null || friend == null) {
      throw new Error('User not found');
    }
    if (user == friend) {
      throw new Error('Cannot add yourself as a friend');
    }
    if (!user.friends) {
      user.friends = [];
    }
    if (!user.requestsReceived.find((e) => e.sender.id == friend.id)) {
      await this.addFriendRequest(id, friend_id);
      return null;
    }
    user.friends.push(friend);
    await this.userRepository.save(user);
    await this.userRepository.save(friend);
    return user;
  }

  public async getFriends(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.friends', 'friends')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      return null;
    }

    return user.friends;
  }

  public async test() {
    if ((await this.userRepository.findOneBy({ id: '1' })) != null) {
      return null;
    }
    const user = new User();
    user.id = '1';
    user.username = 'test';
    user.email = 'test@student.42lyon.fr';
    await this.userRepository.save(user);
    return user;
  }

  public async addBlocked(id: string, blocked_id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    const blocked = await this.userRepository.findOneBy({ id: blocked_id });
    if (user == null || blocked == null) {
      throw new Error('User not found');
    }
    if (user == blocked) {
      throw new Error('Cannot block yourself');
    }
    if (!user.blockedUsers) {
      user.blockedUsers = [];
    }
    user.blockedUsers.push(blocked);
    if (this.isfriend(user, blocked)) {
      await this.removeFriend(user, blocked);
    }
    await this.userRepository.save(user);
    await this.userRepository.save(blocked);
    return user;
  }

  public async getBlocked(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.blockedUsers', 'blockedUsers')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      return null;
    }
    return user.blockedUsers;
  }

  public async getChannels(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.joinedChannels', 'channels')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      return null;
    }
    return user.joinedChannels;
  }

  public async getFriendRequests(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.friendRequests', 'friendRequests')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      return null;
    }
    return user.requestsReceived;
  }

  public async addFriendRequest(id: string, friend_id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    const friend = await this.userRepository.findOneBy({ id: friend_id });
    if (user == null || friend == null) {
      throw new Error('User not found');
    }
    if (user == friend) {
      throw new Error('Cannot add yourself as a friend');
    }
    if (!user.requestsReceived) {
      user.requestsReceived = [];
    }
    const friendrequest = new RequestFriend();
    friendrequest.sender = user;
    friendrequest.receiver = friend;
    user.requestsReceived.push(friendrequest);
    await this.userRepository.save(user);
    await this.userRepository.save(friend);
    return user;
  }

  public async removeFriendRequest(id: string, friend_id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    const friend = await this.userRepository.findOneBy({ id: friend_id });
    if (user == null || friend == null) {
      return null;
    }
    if (user == friend) {
      return null;
    }
    if (!user.requestsReceived || user.requestsReceived.length == 0) {
      return null;
    }
    user.requestsReceived = user.requestsReceived.filter(
      (request) => request.receiver.id != friend.id,
    );
    await this.userRepository.save(user);
    await this.userRepository.save(friend);
    return user;
  }

  public async setName(id: string, name: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (user == null) {
      return null;
    }
    user.username = name;
    await this.userRepository.save(user);
    return user;
  }

  public async setAvatar(id, buffer, extname) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    const lastimage = await this.getPathImage(id);
    if (lastimage != null) {
      fs.unlink(lastimage);
    }
    const imagePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'images',
      `${id}${extname}`,
    );
    try {
      await fs.access(path.dirname(imagePath));
    } catch (error) {
      fs.mkdirSync(path.dirname(imagePath), { recursive: true });
    }
    try {
      fs.writeFileSync(imagePath, buffer);
      return imagePath;
    } catch (error) {
      return null;
    }
  }

  public async isfriendRoute(id: string, friend_id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    const friend = await this.userRepository.findOneBy({ id: friend_id });
    if (user == null || friend == null) {
      throw new Error('User not found');
    }
    if (user == friend) {
      throw new Error('user id and friend id are the same');
    }
    return this.isfriend(user, friend);
  }

  public async getMpChannels(id: string) {
    const channels = await this.getChannels(id);
    if (channels == null) {
      return null;
    }
    return channels.filter((channel) => channel.type == ChannelType.MP_CHANNEL);
  }

  public async set2FASecret(secret: string, id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (user == null) {
      return null;
    }
    user.secret2FA = secret;
    return await this.userRepository.save(user);
  }

  public async enabled2FA(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (user == null) {
      return false;
    }
    user.enabled2FA = true;
    await this.userRepository.save(user);
    return null;
  }

  public async disabled2FA(id: string) {
    let user = await this.userRepository.findOneBy({ id: id });
    if (user == null) {
      return false;
    }
    user.enabled2FA = false;
    user.secret2FA = null;
    user = await this.userRepository.save(user);
    return user != null;
  }

  public async isBlocked(myuser_id: string, user_id: string): Promise<boolean> {
    const myuser = await this.getUserById(myuser_id);
    const user = await this.getUserById(user_id);
    if (user == null && myuser == null) {
      return false;
    }
    myuser.blockedUsers.forEach((element) => {
      if (element.id == user.id) return true;
    });
    return false;
  }

  public async OneOfTwoBlocked(
    myuser_id: string,
    user_id: string,
  ): Promise<boolean> {
    const myuser = await this.getUserById(myuser_id);
    const user = await this.getUserById(user_id);
    if (user == null && myuser == null) {
      return false;
    }
    myuser.blockedUsers.forEach((element) => {
      if (element.id == user.id) return true;
    });
    user.blockedUsers.forEach((element) => {
      if (element.id == myuser.id) return true;
    });
    return false;
  }

  public async getGames(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.games', 'games')
      .where('user.id = :id', { id: id })
      .getOne();
    if (user == null) {
      return null;
    }
    return user.games;
  }

  public async changeStatus(id: string, status: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (user == null) {
      return null;
    }
    user.status = status;
    return await this.userRepository.save(user);
  }

  public async getstatus(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (user == null) {
      return null;
    }
    return user.status;
  }

  public async check2FAenabled(id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (user == null) {
      throw new Error('User not found');
    }
    return user.enabled2FA;
  }

  async signJwtToken(
    userId: string,
    email: string,
    isauth: boolean,
  ): Promise<{ access_token: string }> {
    let expiresTime = '10m';
    if (isauth == true) expiresTime = '2h';
    let check2FA: boolean;
    try {
      check2FA = await this.check2FAenabled(userId);
    } catch (error) {
      check2FA = false;
    }
    const payload = {
      sub: parseInt(userId),
      email: email,
      isauth: isauth,
      enabled2FA: check2FA,
    };
    // const payload = { sub: parseInt(userId), isauth: isauth ,enabled2FA: 1};

    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: expiresTime,
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async removeBlocked(id: string, blocked_id: string) {
    const user = await this.userRepository.findOneBy({ id: id });
    const blocked_user = await this.userRepository.findOneBy({
      id: blocked_id,
    });
    if (user == null || blocked_user == null) {
      throw new Error('User not found');
    }
    if (
      user.blockedUsers.find((element) => element.id == blocked_user.id) == null
    ) {
      throw new Error('User not blocked');
    }
    user.blockedUsers = user.blockedUsers.filter(
      (element) => element.id != blocked_user.id,
    );
    return await this.userRepository.save(user);
  }

  private async removeFriend(user: User, blocked: User) {
    user.friends = user.friends.filter((element) => element.id != blocked.id);
    blocked.friends = blocked.friends.filter(
      (element) => element.id != user.id,
    );
    await this.userRepository.save(user);
    await this.userRepository.save(blocked);
    return true;
  }
}
