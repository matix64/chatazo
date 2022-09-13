import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import {
  RoomMemberEvent,
  RoomsService,
  ROOM_EVENTS,
} from "../rooms/rooms.service";
import {
  MessagesService,
  MESSAGE_EVENTS,
  NewMessageEvent,
} from "./messages.service";
import { MessageDto } from "./models/message.dto";
import { Message } from "./models/message.schema";
import { Request } from "express";
import { User } from "../users/models/user.schema";

@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  clients: Record<string, Socket> = {};

  constructor(
    messageService: MessagesService,
    private roomsService: RoomsService
  ) {
    messageService.on(MESSAGE_EVENTS.newMessage, (m: NewMessageEvent) =>
      this.emitMessage(m)
    );
    roomsService.on(
      ROOM_EVENTS.joinedRoom,
      ({ userId, room }: RoomMemberEvent) =>
        this.clients[userId]?.join("messages:" + room._id.toString())
    );
    roomsService.on(ROOM_EVENTS.leftRoom, ({ userId, room }: RoomMemberEvent) =>
      this.clients[userId]?.leave("messages:" + room._id.toString())
    );
  }

  async handleConnection(client: Socket) {
    const userId = ((client.request as Request).user as User)._id.toString();
    this.clients[userId] = client;
    const rooms = await this.roomsService.getAllWithUser(userId);
    rooms.forEach((r) => client.join("messages:" + r._id.toString()));
  }

  async handleDisconnect(client: Socket) {
    const userId = ((client.request as Request).user as User)._id.toString();
    delete this.clients[userId];
  }

  emitMessage(m: Message) {
    const dto: MessageDto = {
      id: m._id.toString(),
      room: m.room,
      author: m.author,
      date: m.time.getTime(),
      content: m.content,
    };
    this.server.to("messages:" + dto.room).emit("message", dto);
  }
}
