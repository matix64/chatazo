import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { LoggedInGuard } from "../auth/logged-in.guard";
import { EditProfileDto } from "./models/edit-profile.dto";
import { UserProfileDto } from "./models/user-profile.dto";
import { User } from "./models/user.schema";
import { CurrentUser } from "./user.decorator";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(LoggedInGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("me")
  getCurrentUser(@CurrentUser() user: User): UserProfileDto {
    return {
      id: user._id.toString(),
      name: user.name,
      picture: user.picture,
      status: user.status,
    };
  }

  @Patch("me")
  async editProfile(
    @CurrentUser() user: User,
    @Body() changes: EditProfileDto
  ): Promise<UserProfileDto> {
    const newUser = await this.usersService.edit(user._id.toString(), changes);
    return {
      id: newUser._id.toString(),
      name: newUser.name,
      picture: newUser.picture,
      status: newUser.status,
    };
  }

  @Get(":user_id")
  async getUser(@Param("user_id") userId: string): Promise<UserProfileDto> {
    const user = await this.usersService.findById(userId);
    return {
      id: user._id.toString(),
      name: user.name,
      picture: user.picture,
      status: user.status,
    };
  }
}
