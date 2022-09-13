import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from "mongoose";
import isEmail from "validator/lib/isEmail";
import isURL from "validator/lib/isURL";

@Schema()
export class User {
  _id: mongoose.Types.ObjectId;
  @Prop({
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 30,
    trim: true,
  })
  name: string;
  @Prop({ required: true, unique: true, validate: [isEmail], trim: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({
    maxlength: 500,
    validate: [(s: string) => isURL(s, { protocols: ["http", "https"] })],
    trim: true,
  })
  picture: string;
  @Prop({ maxlength: 60, default: "", trim: true })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
