import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  AnyMessageSection,
  Message,
  MessageDocument,
} from "./models/message.schema";
import { Model, FilterQuery } from "mongoose";
import {
  RoomMemberEvent,
  RoomsService,
  ROOM_EVENTS,
} from "../rooms/rooms.service";
import { EventEmitter } from "stream";

export const MESSAGE_EVENTS = {
  newMessage: "newMessage",
};

export type NewMessageEvent = Message;

@Injectable()
export class MessagesService extends EventEmitter {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private roomsService: RoomsService
  ) {
    super();
    this.roomsService.on(ROOM_EVENTS.joinedRoom, (event: RoomMemberEvent) => {
      this.create(event.userId, event.room._id.toString(), [
        { type: "event", event: "join" },
      ]);
    });
    this.roomsService.on(ROOM_EVENTS.leftRoom, (event: RoomMemberEvent) => {
      this.create(event.userId, event.room._id.toString(), [
        { type: "event", event: "leave" },
      ]);
    });
  }

  async create(
    author: string,
    room: string,
    content: AnyMessageSection[]
  ): Promise<Message> {
    const msg = new this.messageModel({ author, room, content });
    const saved = await msg.save();
    this.emit(MESSAGE_EVENTS.newMessage, msg);
    return saved;
  }

  get(
    room: string,
    before: string | undefined,
    amount: number
  ): Promise<Message[]> {
    const filter: FilterQuery<MessageDocument> = { room };
    if (before) filter._id = { $lt: before };
    return this.messageModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(amount)
      .exec();
  }
}
