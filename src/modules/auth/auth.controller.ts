import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuardLocal)
  @Post('login')
  async login(@CurrentUser() user) {
    const access_token = this.authService.generateAccessToken(user);
    return {
      user,
      access_token,
    };
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.userService.create(signUpDto);
    const access_token = this.authService.generateAccessToken(user);

    return {
      user,
      access_token,
    };
  }
}
