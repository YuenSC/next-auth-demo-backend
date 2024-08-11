import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
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

  @Post('google-login')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    const createUserDto = await this.authService.googleLogin(googleLoginDto);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      const access_token = this.authService.generateAccessToken(existingUser);
      return {
        user: existingUser,
        access_token,
      };
    }

    const user = await this.userService.create(createUserDto);
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
