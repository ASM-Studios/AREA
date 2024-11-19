import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.validateUser(body.username, body.password);
  }

  @Post('register')
  async register(@Body() body: {
    username: string;
    password: string;
    email: string;
  }) {
    return this.authService.registerUser(
      body.username,
      body.password,
      body.email
    );
  }
}
