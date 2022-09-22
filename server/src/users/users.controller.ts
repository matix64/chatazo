import {
  Body,
  Controller,
  Get,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  Patch,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SkipThrottle } from "@nestjs/throttler";
import { mkdir } from "fs/promises";
import * as sharp from "sharp";
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

  @UseInterceptors(FileInterceptor("picture"))
  @Patch("me")
  async editProfile(
    @CurrentUser() user: User,
    @Body() changes: EditProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1000 * 1000 })],
        fileIsRequired: false,
      })
    )
    picture?: Express.Multer.File
  ): Promise<UserProfileDto> {
    const allChanges: EditProfileDto & { picture?: string } = changes;
    if (picture) {
      const folder = "./uploads/profiles";
      await mkdir(folder, { recursive: true });
      const fileName = `${folder}/pfp-${user._id.toString()}.jpeg`;
      await sharp(picture.buffer).resize(200, 200).toFile(fileName);
      allChanges.picture = `${fileName}?${new Date().getTime()}`;
    }
    const newUser = await this.usersService.edit(
      user._id.toString(),
      allChanges
    );
    return {
      id: newUser._id.toString(),
      name: newUser.name,
      picture: newUser.picture,
      status: newUser.status,
    };
  }

  @Get(":user_id")
  @SkipThrottle()
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
