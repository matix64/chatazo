import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { compare, hash } from "bcrypt";
import { User } from "src/users/models/user.schema";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async registerUser(name: string, email: string, pass: string): Promise<User> {
    return this.usersService.create(name, email, await hash(pass, 10));
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(pass, user.password))) {
      return user;
    }
    return null;
  }
}
