import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Room, RoomSchema } from "./models/room.schema";
import { RoomController } from "./room.controller";
import { RoomListController } from "./room-list.controller";
import { RoomsService } from "./rooms.service";
import { RoomsGateway } from "./rooms.gateway";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [RoomListController, RoomController],
  providers: [RoomsService, RoomsGateway],
  exports: [RoomsService],
})
export class RoomsModule {}
