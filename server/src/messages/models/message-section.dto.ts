import { TypeOptions } from "class-transformer";
import { IsIn, IsNotEmpty, IsOptional, IsUrl, Length } from "class-validator";

export class MessageSectionDto {
  type: "text" | "image" | "event";
}

export class UserMessageSectionDto extends MessageSectionDto {
  @IsIn(["text", "image"])
  type: "text" | "image";
}

export class TextSectionDto extends UserMessageSectionDto {
  type: "text";
  @IsNotEmpty()
  content: string;
  @IsOptional()
  @Length(1, 48)
  format: string;
}

export class ImageSectionDto extends UserMessageSectionDto {
  type: "image";
  @IsUrl({ protocols: ["http", "https"] })
  @Length(1, 256)
  url: string;
}

export class EventSectionDto extends MessageSectionDto {
  type: "event";
  event: string;
}

export const UserMessageSectionTypeOptions: TypeOptions = {
  keepDiscriminatorProperty: true,
  discriminator: {
    property: "type",
    subTypes: [
      { name: "text", value: TextSectionDto },
      { name: "image", value: ImageSectionDto },
    ],
  },
};

export type AnyMessageSectionDto =
  | TextSectionDto
  | ImageSectionDto
  | EventSectionDto;
export type AnyUserMessageSectionDto = TextSectionDto | ImageSectionDto;
