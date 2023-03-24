import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>, private authService: AuthService) {}

    public async createUsers(code) {
        const retIntra =  await this.authService.getToken(code);
        if (retIntra == null) {
            return null;
        }
        const retUser = await this.authService.getUserIntra(retIntra.access_token);
        console.log(retUser.id);
        console.log(retUser.login);
        console.log(retUser.image.link);
        const user = new User();
        user.id = retUser.id;
        user.username = retUser.login;
        user.avatar_url = retUser.image.link;
        if (await this.userRepository.findOneBy({id : user.id}) != null) {
            return null;
        }
        await this.userRepository.save(user);
        return user;
    }

    public async getUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }
}