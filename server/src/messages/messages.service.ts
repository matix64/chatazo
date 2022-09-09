import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AnyMessageSection,
  Message,
  MessageDocument,
} from './models/message.schema';
import { Model, FilterQuery } from 'mongoose';
import { UnsubscribeFunc } from '../common';
import { RoomsService } from '../rooms/rooms.service';

type NewMessageCallback = (m: Message) => void;

@Injectable()
export class MessagesService {
  private readonly newMessageSubs: NewMessageCallback[] = [];

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private roomsService: RoomsService,
  ) {
    this.roomsService.subscribeJoinedRoom((user, room) =>
      this.create(user, room._id.toString(), [
        { type: 'event', event: 'join' },
      ]),
    );
    this.roomsService.subscribeLeftRoom((user, room) => {
      this.create(user, room._id.toString(), [
        { type: 'event', event: 'leave' },
      ]);
    });
  }

  async create(
    author: string,
    room: string,
    content: AnyMessageSection[],
  ): Promise<Message> {
    const msg = new this.messageModel({ author, room, content });
    const saved = await msg.save();
    this.newMessageSubs.forEach((s) => s(msg));
    return saved;
  }

  get(
    room: string,
    before: string | undefined,
    amount: number,
  ): Promise<Message[]> {
    const filter: FilterQuery<MessageDocument> = { room };
    if (before) filter._id = { $lt: before };
    return this.messageModel
      .find(filter)
      .sort({ _id: -1 })
      .limit(amount)
      .exec();
  }

  subscribeNewMessages(cb: NewMessageCallback): UnsubscribeFunc {
    this.newMessageSubs.push(cb);
    return () => this.newMessageSubs.splice(this.newMessageSubs.indexOf(cb, 1));
  }
}
