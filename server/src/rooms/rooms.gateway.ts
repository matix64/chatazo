import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {
  RoomChangedEvent,
  RoomMemberEvent,
  RoomsService,
  ROOM_EVENTS,
} from "./rooms.service";
import { Request } from "express";
import { User } from "../users/models/user.schema";
import { RoomInfoDto } from "./models/room-info.dto";

@WebSocketGateway()
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  clients: Record<string, Socket> = {};

  constructor(private roomsService: RoomsService) {
    roomsService.on(ROOM_EVENTS.roomChanged, (room: RoomChangedEvent) => {
      const dto: RoomInfoDto = { id: room._id.toString(), name: room.name };
      this.server.to("room:" + dto.id).emit("roomChanged", dto);
    });
    roomsService.on(
      ROOM_EVENTS.joinedRoom,
      ({ userId, room }: RoomMemberEvent) =>
        this.clients[userId]?.join("room:" + room._id.toString())
    );
    roomsService.on(ROOM_EVENTS.leftRoom, ({ userId, room }: RoomMemberEvent) =>
      this.clients[userId]?.leave("room:" + room._id.toString())
    );
  }

  async handleConnection(client: Socket) {
    const userId = ((client.request as Request).user as User)._id.toString();
    this.clients[userId] = client;
    const rooms = await this.roomsService.getAllWithUser(userId);
    rooms.forEach((r) => client.join("room:" + r._id.toString()));
  }

  async handleDisconnect(client: Socket) {
    const userId = ((client.request as Request).user as User)._id.toString();
    delete this.clients[userId];
  }
}
