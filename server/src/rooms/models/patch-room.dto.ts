import { IsString } from 'class-validator';

export class PatchRoomDto {
  @IsString()
  name: string;
}
