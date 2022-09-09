import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Invite {
  _id: Types.ObjectId;
  @Prop({ required: true })
  room: string;
  @Prop({ required: true })
  creator: string;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
export type InviteDocument = Invite & Document;
