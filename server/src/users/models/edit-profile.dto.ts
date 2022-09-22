import { IsOptional, IsString, IsUrl } from "class-validator";

export class EditProfileDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  status?: string;
}
