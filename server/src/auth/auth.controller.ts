import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from './models/register.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() user: RegisterDto) {
    await this.authService.registerUser(
      user.username,
      user.email,
      user.password,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(204)
  async login() {
    return;
  }
}
