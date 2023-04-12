import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { EventsGateway } from "./events.gateway";
import { Channel } from "src/channel/channel.entity";
import { ChannelService } from "src/channel/channel.service";

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigModule, AuthModule, TypeOrmModule.forFeature([Channel])],
    controllers: [],
    providers: [EventsGateway, UserService, AuthService, JwtService ,ConfigService, ChannelService],
})
export class EventModule {}