import { Prisma } from '@prisma/client';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto implements Prisma.UserCreateInput {
  @IsEmail()
  email: string;

  @IsString()
  @Length(2)
  name: string;

  @IsStrongPassword({
    minLength: 8,
    minSymbols: 1,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  password: string;
}
