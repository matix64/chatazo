import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { Room } from '../rooms/models/room.schema';
import { RoomsService } from '../rooms/rooms.service';
import { InvitePreviewDto } from './models/invite-preview.dto';
import { Invite, InviteDocument } from './models/invite.schema';

@Injectable()
export class InvitesService {
  constructor(
    @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    private roomService: RoomsService,
  ) {}

  async create(creator: string, room: string): Promise<Invite> {
    const _id = await new Promise<string>((resolve, fail) =>
      randomBytes(12, (err, bytes) => {
        if (err) fail(err);
        else resolve(bytes.toString('hex'));
      }),
    );
    const created = new this.inviteModel({ _id, creator, room });
    return created.save();
  }

  /**
   * Returns info about an invite and its room that can be shown to users before they join.
   * @throws {NotFoundException} If the invite doesn't exist
   */
  async getPreview(inviteId: string): Promise<InvitePreviewDto> {
    const invite = await this.inviteModel.findById(inviteId);
    if (!invite) throw new NotFoundException();
    const room = await this.roomService.getById(invite.room);
    if (!room) throw new InternalServerErrorException();
    return {
      room: {
        id: room._id.toString(),
        name: room.name,
        members: room.members.length,
      },
    };
  }

  /**
   * Looks for an invite with this id and adds the user to the corresponding room.
   * @throws {NotFoundException} If the invite doesn't exist
   * @returns The room that the user joined
   */
  async use(inviteId: string, userId: string): Promise<Room> {
    const invite = await this.inviteModel.findById(inviteId);
    if (!invite) throw new NotFoundException();
    return this.roomService.addMember(invite.room, userId);
  }
}
