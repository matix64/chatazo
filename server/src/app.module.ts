import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { InvitesModule } from './invites/invites.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://192.168.0.203/chat'),
    UsersModule,
    AuthModule,
    RedisModule,
    RoomsModule,
    MessagesModule,
    InvitesModule,
  ],
})
export class AppModule {}
