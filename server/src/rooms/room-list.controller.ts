import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./models/create-room.dto";
import { CurrentUser } from "../users/user.decorator";
import { User } from "../users/models/user.schema";
import { RoomInfoDto } from "./models/room-info.dto";
import { LoggedInGuard } from "../auth/logged-in.guard";

@Controller("rooms")
@UseGuards(LoggedInGuard)
export class RoomListController {
  constructor(private roomsService: RoomsService) {}

  @Post()
  async createRoom(
    @CurrentUser() user: User,
    @Body() room: CreateRoomDto
  ): Promise<RoomInfoDto> {
    const created = await this.roomsService.create(
      room.name,
      user._id.toString()
    );
    return { id: created._id.toString(), name: created.name };
  }

  @Get()
  async getRooms(@CurrentUser() user: User): Promise<RoomInfoDto[]> {
    const rooms = await this.roomsService.getAllWithUser(user._id.toString());
    return rooms.map((r) => ({ id: r._id.toString(), name: r.name }));
  }
}
