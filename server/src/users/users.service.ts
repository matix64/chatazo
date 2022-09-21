import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./models/user.schema";
import { Model } from "mongoose";
import { EventEmitter } from "stream";

export const USER_EVENTS = {
  profileChanged: "profileChanged",
};

export type ProfileChangedEvent = User;

@Injectable()
export class UsersService extends EventEmitter {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super();
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const created = new this.userModel({ name, email, password });
    return created.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async edit(id: string, changes: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: changes },
      { runValidators: true, new: true }
    );
    if (!user) throw new NotFoundException();
    const event: ProfileChangedEvent = user;
    this.emit(USER_EVENTS.profileChanged, event);
    return user;
  }
}
