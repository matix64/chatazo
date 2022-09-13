import { IsOptional, IsString, IsUrl } from "class-validator";

export class EditProfileDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsUrl({ protocols: ["http", "https"] })
  picture?: string;
  @IsOptional()
  @IsString()
  status?: string;
}
