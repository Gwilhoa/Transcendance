import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { EventModule } from './events/event.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    ChannelModule,
    EventModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
