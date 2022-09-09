import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../users/models/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private userService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err: Error, id: string) => void) {
    done(null, user._id.toString());
  }

  async deserializeUser(id: string, done: (err: Error, user: User) => void) {
    const user = await this.userService.findById(id);
    done(null, user);
  }
}
