import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
