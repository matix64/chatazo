import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../users/models/user.schema';
import { RoomsService } from './rooms.service';
import mongoose from 'mongoose';
import { Reflector } from '@nestjs/core';
import { REQ_ROLE_METADATA } from './roles.decorator';
import { Role } from './models/roles';

@Injectable()
export class RoomMemberGuard implements CanActivate {
  private logger = new Logger(RoomMemberGuard.name);

  constructor(
    private reflector: Reflector,
    private roomService: RoomsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    if (!req.isAuthenticated()) {
      throw new UnauthorizedException();
    }
    const user = req.user as User;
    const roomId = req.params.room_id;
    if (!roomId) {
      this.logger.error('room_id url param is undefined');
      throw new InternalServerErrorException();
    }
    if (!mongoose.Types.ObjectId.isValid(roomId))
      throw new BadRequestException();
    const room = await this.roomService.getById(roomId);
    if (!room) throw new NotFoundException();
    const member = room.getMember(user._id.toString());
    if (!member) throw new NotFoundException();
    const requiredRole =
      this.reflector.get<Role>(REQ_ROLE_METADATA, context.getHandler()) ||
      Role.Member;
    return requiredRole <= member.role;
  }
}
