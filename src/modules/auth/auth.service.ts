import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

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

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      omit: { password: false },
    });
    if (!user) {
      throw new Error('No user found with this email address.');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid password.');
    }
    return this.userService.excludeUserFields(user, ['password']);
  }
}
