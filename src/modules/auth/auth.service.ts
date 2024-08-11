import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDto,
  UserProvider,
  UserRole,
} from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { GoogleLoginDto } from './dto/google-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  generateAccessToken(user: User) {
    return this.jwtService.sign({ username: user.email, sub: user.id });
  }

  async validateUser(
    email: string,
    password: string,
    requiredProvider?: UserProvider,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      omit: { password: false },
    });
    if (!user) {
      throw new Error('No user found with this email address.');
    }

    if (requiredProvider && user.provider !== requiredProvider) {
      throw new Error(
        `Your email is not registered with ${requiredProvider}. Please login with another method.`,
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid password.');
    }
    return this.userService.excludeUserFields(user, ['password']);
  }

  async googleLogin({ token }: GoogleLoginDto) {
    const client = new OAuth2Client(process.env.AUTH_GOOGLE_CLIENT_ID);
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.AUTH_GOOGLE_CLIENT_ID,
      });
      const { email, name } = ticket.getPayload();

      return {
        email,
        name,
        role: UserRole.USER,
        provider: UserProvider.google,
      } as CreateUserDto;
    } catch (error) {
      throw new BadRequestException('Something wrong in google login.');
    }
  }
}
