import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import isURL from 'validator/lib/isURL';

@Schema({ _id: false, discriminatorKey: 'type' })
class MessageSection {
  @Prop({ required: true, enum: ['text', 'image', 'event'] })
  type: 'text' | 'image' | 'event';
}

const MessageSectionSchema = SchemaFactory.createForClass(MessageSection);

@Schema({ _id: false })
export class TextSection {
  type: 'text';
  @Prop({ required: true })
  content: string;
  format: string;
}

@Schema({ _id: false })
export class ImageSection {
  type: 'image';
  @Prop({
    required: true,
    validate: [(s: string) => isURL(s, { protocols: ['http', 'https'] })],
  })
  url: string;
}

@Schema({ _id: false })
export class EventSection {
  type: 'event';
  @Prop({ required: true, enum: ['join', 'leave'] })
  event: 'join' | 'leave';
}

export type AnyMessageSection = TextSection | ImageSection | EventSection;

@Schema()
export class Message {
  _id: Types.ObjectId;
  @Prop({ required: true })
  room: string;
  @Prop({ required: true })
  author: string;
  @Prop({ required: true, default: () => new Date() })
  time: Date;
  @Prop({ required: true, type: [MessageSectionSchema], discriminators: [] })
  content: AnyMessageSection[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
const contentPath =
  MessageSchema.path<mongoose.Schema.Types.DocumentArray>('content');
contentPath.discriminator('text', SchemaFactory.createForClass(TextSection));
contentPath.discriminator('image', SchemaFactory.createForClass(ImageSection));
contentPath.discriminator('event', SchemaFactory.createForClass(EventSection));

export type MessageDocument = Message & Document;
