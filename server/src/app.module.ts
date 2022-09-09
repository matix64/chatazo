import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./redis/redis.module";
import { RoomsModule } from "./rooms/rooms.module";
import { MessagesModule } from "./messages/messages.module";
import { InvitesModule } from "./invites/invites.module";
import { readConfig } from "./config";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [readConfig] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get("mongo_url"),
      }),
    }),
    UsersModule,
    AuthModule,
    RedisModule,
    RoomsModule,
    MessagesModule,
    InvitesModule,
  ],
})
export class AppModule {}
