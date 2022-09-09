import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoomInfoDto } from 'src/rooms/models/room-info.dto';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { RoomMemberGuard } from '../rooms/room-member.guard';
import { User } from '../users/models/user.schema';
import { CurrentUser } from '../users/user.decorator';
import { InvitesService } from './invites.service';
import { InvitePreviewDto } from './models/invite-preview.dto';
import { InviteDto } from './models/invite.dto';

@Controller('invites')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @Post('create/:room_id')
  @UseGuards(RoomMemberGuard)
  async createInvite(
    @CurrentUser() user: User,
    @Param('room_id') roomId: string,
  ): Promise<InviteDto> {
    const invite = await this.invitesService.create(
      user._id.toString(),
      roomId,
    );
    return {
      id: invite._id.toString(),
      room: invite.room,
      creator: invite.creator,
    };
  }

  @Get(':invite_id')
  async viewInvite(
    @Param('invite_id') inviteId: string,
  ): Promise<InvitePreviewDto> {
    return this.invitesService.getPreview(inviteId);
  }

  @Post(':invite_id')
  @UseGuards(LoggedInGuard)
  async useInvite(
    @CurrentUser() user: User,
    @Param('invite_id') inviteId: string,
  ): Promise<RoomInfoDto> {
    const room = await this.invitesService.use(inviteId, user._id.toString());
    return {
      id: room._id.toString(),
      name: room.name,
    };
  }
}
