import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { RegisterDto } from "./models/register.dto";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() user: RegisterDto) {
    await this.authService.registerUser(
      user.username,
      user.email,
      user.password
    );
  }

  @Post("logout")
  async logout(@Req() req: Request) {
    const err = await new Promise((r) => req.logout(r));
    if (err) throw err;
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(204)
  async login() {
    return;
  }
}
