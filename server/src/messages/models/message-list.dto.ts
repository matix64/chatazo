import { MessageDto } from './message.dto';

export class MessageListDto {
  messages: MessageDto[];
  noOlder: boolean;
}
