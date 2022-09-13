import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {
  ProfileChangedEvent,
  UsersService,
  USER_EVENTS,
} from "./users.service";
import { isValidObjectId } from "mongoose";
import { IsString } from "class-validator";
import { UserProfileDto } from "./models/user-profile.dto";

class ObserveUserRequest {
  @IsString()
  userId: string;
}

type ObserveUserEvent = UserProfileDto;

@WebSocketGateway()
export class UsersGateway {
  @WebSocketServer()
  server: Server;

  constructor(usersService: UsersService) {
    usersService.on(USER_EVENTS.profileChanged, (user: ProfileChangedEvent) => {
      const event: ObserveUserEvent = {
        id: user._id.toString(),
        name: user.name,
        status: user.status,
        picture: user.picture,
      };
      this.server.to("user:" + user._id).emit("userChanged", event);
    });
  }

  @SubscribeMessage("obsUser")
  async onObserveUserRequest(
    @MessageBody() request: ObserveUserRequest,
    @ConnectedSocket() client: Socket
  ) {
    if (!isValidObjectId(request.userId)) return;
    client.join("user:" + request.userId);
  }

  @SubscribeMessage("unobsUser")
  async onUnobserveUserRequest(
    @MessageBody() request: ObserveUserRequest,
    @ConnectedSocket() client: Socket
  ) {
    if (!isValidObjectId(request.userId)) return;
    client.leave("user:" + request.userId);
  }
}
