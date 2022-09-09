import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/users/models/user.schema';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(name: string, pass: string): Promise<User> {
    const user = await this.authService.validateUser(name, pass);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
