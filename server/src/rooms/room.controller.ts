import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { User } from '../users/models/user.schema';
import { CurrentUser } from '../users/user.decorator';
import { PatchMemberDto } from './models/patch-member.dto';
import { PatchRoomDto } from './models/patch-room.dto';
import { Role } from './models/roles';
import { RoomMemberDto } from './models/room-member.dto';
import { RequireRole } from './roles.decorator';
import { RoomMemberGuard } from './room-member.guard';
import { RoomsService } from './rooms.service';

@Controller('rooms/:room_id')
@UseGuards(RoomMemberGuard)
export class RoomController {
  constructor(private roomsService: RoomsService) {}

  @Get('members')
  async getMembers(@Param('room_id') id: string): Promise<RoomMemberDto[]> {
    const room = await this.roomsService.getById(id);
    return room.members.map((m) => ({
      userId: m.id,
      role: m.role,
    }));
  }

  @Patch('members/:member_id')
  @RequireRole(Role.Admin)
  async editMember(
    @CurrentUser() user: User,
    @Param('room_id') roomId: string,
    @Param('member_id') memberId: string,
    @Body() patches: PatchMemberDto,
  ): Promise<void> {
    const room = await this.roomsService.getById(roomId);
    const userRole = room.getMember(user._id.toString())?.role;
    if (patches.role && patches.role >= userRole)
      throw new UnauthorizedException();
    await this.roomsService.patchMember(roomId, memberId, patches, userRole);
  }

  @Delete('members/:member_id')
  @RequireRole(Role.Moderator)
  async kickMember(
    @CurrentUser() user: User,
    @Param('room_id') roomId: string,
    @Param('member_id') memberId: string,
  ): Promise<void> {
    const room = await this.roomsService.getById(roomId);
    const userRole = room.getMember(user._id.toString())?.role;
    await this.roomsService.removeMember(roomId, memberId, userRole);
  }

  @Patch()
  @RequireRole(Role.Admin)
  async editRoom(
    @Param('room_id') id: string,
    @Body() patches: PatchRoomDto,
  ): Promise<void> {
    await this.roomsService.patch(id, patches);
  }

  @Delete()
  @RequireRole(Role.Owner)
  async deleteRoom(@Param('room_id') id: string): Promise<void> {
    await this.roomsService.delete(id);
  }
}
