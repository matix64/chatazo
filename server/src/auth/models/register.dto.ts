import { IsEmail, Length } from 'class-validator';

export class RegisterDto {
  @Length(4, 30)
  username: string;
  @IsEmail()
  email: string;
  @Length(8, 72)
  password: string;
}
