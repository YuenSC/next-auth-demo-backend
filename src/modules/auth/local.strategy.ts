import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserProvider } from '../user/dto/create-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(email, password);
      if (user.provider !== UserProvider.email) {
        throw new BadRequestException(
          `Your email is not registered with password. Please login with another method.`,
        );
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
