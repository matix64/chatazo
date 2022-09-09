import { IsEnum, IsOptional } from 'class-validator';
import { Role } from './roles';

export class PatchMemberDto {
  @IsOptional()
  @IsEnum(Role)
  role: Role | undefined;
}
