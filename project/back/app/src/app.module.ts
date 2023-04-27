import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {ChannelModule} from './channel/channel.module';
import {EventModule} from './events/event.module';
import {GameModule} from './game/game.module';

@Module({
	imports: [DatabaseModule, AuthModule, UserModule, ChannelModule, EventModule, GameModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}


// import {Module} from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import {AppController} from './app.controller';
// import {AppService} from './app.service';
// import {DatabaseModule} from './database/database';
// import {AuthModule} from './auth/auth.module';
// import {UserModule} from './user/user.module';
// import {ChannelModule} from './channel/channel.module';
// import {EventModule} from './events/event.module';
// import {GameModule} from './game/game.module';
// import { UserService } from './user/user.service';
// import { AuthService } from './auth/auth.service';
// import { User } from 'src/user/user.entity';
// import { TypeOrmModule } from '@nestjs/typeorm';

// @Module({
// 	imports: [DatabaseModule, AuthModule, UserModule, ChannelModule, EventModule, GameModule, TypeOrmModule.forFeature([User])],
// 	controllers: [AppController],
// 	providers: [AppService, ConfigService, AuthService, UserService],
// })
// export class AppModule {
// }
