import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Room, RoomDocument, RoomMember } from "./models/room.schema";
import { Model } from "mongoose";
import { Role } from "./models/roles";
import { EventEmitter } from "stream";

export const ROOM_EVENTS = {
  joinedRoom: "joinedRoom",
  leftRoom: "leftRoom",
  roomChanged: "roomChanged",
};

export interface RoomMemberEvent {
  userId: string;
  room: Room;
}

export type RoomChangedEvent = Room;

@Injectable()
export class RoomsService extends EventEmitter {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {
    super();
  }

  async create(name: string, owner: string): Promise<Room> {
    const created = new this.roomModel({
      name,
      members: { id: owner, role: Role.Owner },
    });
    const room = await created.save();
    const event: RoomMemberEvent = { userId: owner, room };
    this.emit(ROOM_EVENTS.joinedRoom, event);
    return room;
  }

  getAllWithUser(user: string): Promise<Room[]> {
    return this.roomModel.find({ "members.id": user }).exec();
  }

  getById(id: string): Promise<Room | null> {
    return this.roomModel.findById(id).exec();
  }

  delete(id: string): Promise<Room> {
    return this.roomModel.findByIdAndDelete(id).exec();
  }

  async patch(id: string, patches: Pick<Partial<Room>, "name">): Promise<Room> {
    const room = await this.roomModel.findByIdAndUpdate(
      id,
      { $set: patches },
      { runValidators: true, new: true }
    );
    if (!room) throw new NotFoundException();
    const event: RoomChangedEvent = room;
    this.emit(ROOM_EVENTS.roomChanged, event);
    return room;
  }

  async addMember(roomId: string, userId: string): Promise<Room> {
    const room = await this.roomModel.findOneAndUpdate(
      { _id: roomId, "members.id": { $ne: userId } },
      { $push: { members: { id: userId, role: Role.Member } } },
      { runValidators: true, new: true }
    );
    if (!room) throw new NotFoundException();
    const event: RoomMemberEvent = { userId, room };
    this.emit(ROOM_EVENTS.joinedRoom, event);
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
    patches: Pick<Partial<RoomMember>, "role">,
    belowRole: Role
  ): Promise<Room> {
    const room = await this.roomModel.findOneAndUpdate(
      {
        _id: roomId,
        members: { $elemMatch: { id: userId, role: { $lt: belowRole } } },
      },
      {
        $set: Object.fromEntries(
          Object.entries(patches).map(([key, val]) => ["members.$." + key, val])
        ),
      },
      { runValidators: true, new: true }
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
    belowRole: Role
  ): Promise<Room> {
    const room = await this.roomModel.findByIdAndUpdate(
      roomId,
      {
        $pull: { members: { id: userId, role: { $lt: belowRole } } },
      },
      { new: true }
    );
    if (!room) throw new NotFoundException();
    if (room.members.find((m) => m.id == userId))
      throw new ForbiddenException();
    const event: RoomMemberEvent = { userId, room };
    this.emit(ROOM_EVENTS.leftRoom, event);
    return room;
  }
}
