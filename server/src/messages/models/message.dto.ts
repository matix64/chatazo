import { AnyMessageSectionDto } from './message-section.dto';

export class MessageDto {
  id: string;
  room: string;
  author: string;
  date: number;
  content: AnyMessageSectionDto[];
}
