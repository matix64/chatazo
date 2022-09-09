import { TypeOptions } from 'class-transformer';
import { IsIn, IsNotEmpty, IsUrl } from 'class-validator';

export class MessageSectionDto {
  type: 'text' | 'image' | 'event';
}

export class UserMessageSectionDto extends MessageSectionDto {
  @IsIn(['text', 'image'])
  type: 'text' | 'image';
}

export class TextSectionDto extends UserMessageSectionDto {
  type: 'text';
  @IsNotEmpty()
  content: string;
  format: string;
}

export class ImageSectionDto extends UserMessageSectionDto {
  type: 'image';
  @IsUrl({ protocols: ['http', 'https'] })
  url: string;
}

export class EventSectionDto extends MessageSectionDto {
  type: 'event';
  event: string;
}

export const UserMessageSectionTypeOptions: TypeOptions = {
  keepDiscriminatorProperty: true,
  discriminator: {
    property: 'type',
    subTypes: [
      { name: 'text', value: TextSectionDto },
      { name: 'image', value: ImageSectionDto },
    ],
  },
};

export type AnyMessageSectionDto =
  | TextSectionDto
  | ImageSectionDto
  | EventSectionDto;
export type AnyUserMessageSectionDto = TextSectionDto | ImageSectionDto;
