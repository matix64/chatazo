import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { unreachable } from "src/util";
import {
  UserMessageSectionTypeOptions,
  UserMessageSectionDto,
  AnyUserMessageSectionDto,
} from "./message-section.dto";

@ValidatorConstraint()
class MessageContentValidator implements ValidatorConstraintInterface {
  validate(value: AnyUserMessageSectionDto[]): boolean {
    let totalTextLen = 0;
    let lastSectionType = "";
    let imageSections = 0;
    for (const section of value) {
      switch (section.type) {
        case "text":
          totalTextLen += section.content.length;
          if (totalTextLen > 2000 || lastSectionType == "text") return false;
          break;
        case "image":
          imageSections++;
          if (imageSections > 3) return false;
          break;
        default:
          unreachable(section);
      }
      lastSectionType = section.type;
    }
    return true;
  }
}

export class SendMessageDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UserMessageSectionDto, UserMessageSectionTypeOptions)
  @Validate(MessageContentValidator, { message: "Invalid message" })
  content: AnyUserMessageSectionDto[];
}
