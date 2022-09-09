import { IsNotEmpty, Length } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  email: string;
  @Length(8, 72)
  password: string;
}
