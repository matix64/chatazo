import { Type } from 'class-transformer';
import { ArrayNotEmpty, ValidateNested } from 'class-validator';
import {
  UserMessageSectionTypeOptions,
  UserMessageSectionDto,
  AnyUserMessageSectionDto,
} from './message-section.dto';

export class SendMessageDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UserMessageSectionDto, UserMessageSectionTypeOptions)
  content: AnyUserMessageSectionDto[];
}
