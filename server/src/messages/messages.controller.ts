import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '../users/models/user.schema';
import { CurrentUser } from '../users/user.decorator';
import { RoomMemberGuard } from '../rooms/room-member.guard';
import { MessagesService } from './messages.service';
import { MessageDto } from './models/message.dto';
import { SendMessageDto } from './models/send-message.dto';
import { MessageListDto } from './models/message-list.dto';

@Controller('messages/:room_id')
@UseGuards(RoomMemberGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  async getMessages(
    @Param('room_id') room: string,
    @Query('before') before: string | undefined,
  ): Promise<MessageListDto> {
    const MAX_MESSAGES = 20;
    const msgs = await this.messagesService.get(room, before, MAX_MESSAGES);
    return {
      messages: msgs.map((m) => ({
        id: m._id.toString(),
        room: m.room,
        author: m.author,
        date: m.time.getTime(),
        content: m.content,
      })),
      noOlder: msgs.length < MAX_MESSAGES,
    };
  }

  @Post()
  async sendMessage(
    @CurrentUser() user: User,
    @Param('room_id') room: string,
    @Body() message: SendMessageDto,
  ) {
    await this.messagesService.create(
      user._id.toString(),
      room,
      message.content,
    );
  }
}
