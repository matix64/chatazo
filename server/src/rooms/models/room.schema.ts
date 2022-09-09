import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from './roles';

@Schema({ _id: false })
export class RoomMember {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true, default: 1 })
  role: Role;
}

const RoomMemberSchema = SchemaFactory.createForClass(RoomMember);

@Schema()
export class Room {
  _id: Types.ObjectId;
  @Prop({ required: true, minlength: 1, maxlength: 40 })
  name: string;
  @Prop({ required: true, type: [RoomMemberSchema] })
  members: RoomMember[];

  getMember: (memberId: string) => RoomMember | undefined;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
export type RoomDocument = Room & Document;

RoomSchema.methods.getMember = function (
  this: Room,
  memberId: string,
): RoomMember | undefined {
  return this.members.find((m) => m.id === memberId);
};
