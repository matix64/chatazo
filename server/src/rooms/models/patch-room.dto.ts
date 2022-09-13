import { Transform } from "class-transformer";
import { IsString, Length } from "class-validator";

export class PatchRoomDto {
  @IsString()
  @Transform(({ value }) => value.replace(/[\n\r]/, " ").trim())
  @Length(1, 40)
  name: string;
}
