import {Module} from '@nestjs/common';
import {ChannelService} from './channel.service';
import {ChannelController} from './channel.controller';
import {Channel} from './channel.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'src/user/user.entity';
import {UserService} from 'src/user/user.service';
import {UserModule} from 'src/user/user.module';
import {AuthService} from 'src/auth/auth.service';
import {JwtService} from '@nestjs/jwt';
import {AuthModule} from 'src/auth/auth.module';
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
	providers: [ChannelService, AuthService, JwtService, ConfigService, UserService],
	controllers: [ChannelController],
	imports: [TypeOrmModule.forFeature([Channel]), TypeOrmModule.forFeature([User]), AuthModule, ConfigModule, UserModule]
})
export class ChannelModule {
}
