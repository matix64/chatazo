import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./models/user.schema";
import { UsersController } from "./users.controller";
import { UsersGateway } from "./users.gateway";
import { UsersService } from "./users.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersGateway],
  exports: [UsersService],
})
export class UsersModule {}
