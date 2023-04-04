import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { EventsGateway } from "./events.gateway";

@Module({
    imports: [TypeOrmModule.forFeature([User]), ConfigModule, AuthModule],
    controllers: [],
    providers: [EventsGateway, UserService, AuthService, JwtService ,ConfigService],
})
export class EventModule {}