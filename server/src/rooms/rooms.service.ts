import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument, RoomMember } from './models/room.schema';
import { Model } from 'mongoose';
import { UnsubscribeFunc } from '../common';
import { Role } from './models/roles';

type RoomMemberCallback = (userId: string, room: Room) => void;

@Injectable()
export class RoomsService {
  private readonly joinedRoomSubs: RoomMemberCallback[] = [];
  private readonly leftRoomSubs: RoomMemberCallback[] = [];

  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(name: string, owner: string): Promise<Room> {
    const created = new this.roomModel({
      name,
      members: { id: owner, role: Role.Owner },
    });
    const saved = await created.save();
    this.joinedRoomSubs.forEach((cb) => cb(owner, saved));
    return saved;
  }

  getAllWithUser(user: string): Promise<Room[]> {
    return this.roomModel.find({ 'members.id': user }).exec();
  }

  getById(id: string): Promise<Room | null> {
    return this.roomModel.findById(id).exec();
  }

  delete(id: string): Promise<Room> {
    return this.roomModel.findByIdAndDelete(id).exec();
  }

  patch(id: string, patches: Pick<Partial<Room>, 'name'>): Promise<Room> {
    return this.roomModel
      .findByIdAndUpdate(id, { $set: patches }, { runValidators: true })
      .exec();
  }

  async addMember(roomId: string, userId: string): Promise<Room> {
    const room = await this.roomModel.findOneAndUpdate(
      { _id: roomId, 'members.id': { $ne: userId } },
      { $push: { members: { id: userId, role: Role.Member } } },
      { runValidators: true },
    );
    if (!room) throw new NotFoundException();
    this.joinedRoomSubs.forEach((cb) => cb(userId, room));
    return room;
  }

  /**
   * Patches a member if their role is below `belowRole`
   * @throws {NotFoundException} If the room or member doesn't exist,
   * or if the member's role is equal or higher than `belowRole`
   */
  async patchMember(
    roomId: string,
    userId: string,
    patches: Pick<Partial<RoomMember>, 'role'>,
    belowRole: Role,
  ): Promise<Room> {
    const room = await this.roomModel.findOneAndUpdate(
      {
        _id: roomId,
        members: { $elemMatch: { id: userId, role: { $lt: belowRole } } },
      },
      {
        $set: Object.fromEntries(
          Object.entries(patches).map(([key, val]) => [
            'members.$.' + key,
            val,
          ]),
        ),
      },
      { runValidators: true },
    );
    if (!room) throw new NotFoundException();
    return room;
  }

  /**
   * Removes a member from the room if their role is below `belowRole`
   * @throws {NotFoundException} If the room doesn't exist
   * @throws {ForbiddenException} If the member's role is equal or higher than `belowRole`
   */
  async removeMember(
    roomId: string,
    userId: string,
    belowRole: Role,
  ): Promise<Room> {
    const room = await this.roomModel.findByIdAndUpdate(
      roomId,
      {
        $pull: { members: { id: userId, role: { $lt: belowRole } } },
      },
    );
    if (!room) throw new NotFoundException();
    if (room.members.find((m) => m.id == userId))
      throw new ForbiddenException();
    this.leftRoomSubs.forEach((cb) => cb(userId, room));
    return room;
  }

  subscribeJoinedRoom(cb: RoomMemberCallback): UnsubscribeFunc {
    this.joinedRoomSubs.push(cb);
    return () => this.joinedRoomSubs.splice(this.joinedRoomSubs.indexOf(cb, 1));
  }

  subscribeLeftRoom(cb: RoomMemberCallback): UnsubscribeFunc {
    this.leftRoomSubs.push(cb);
    return () => this.leftRoomSubs.splice(this.leftRoomSubs.indexOf(cb, 1));
  }
}
