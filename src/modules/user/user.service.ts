import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListQueryParams } from 'src/common/list-query.decorator';
import { generatePaginationResponse } from 'src/common/pagination.util';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      createUserDto.password = await this.authService.hashPassword(
        createUserDto.password,
      );
    }

    return this.prisma.user
      .create({
        data: createUserDto,
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Account with the same email already exists.',
          );
        }
        throw error;
      });
  }

  async findAll({ page, limit, searchText }: ListQueryParams) {
    const res = await this.prisma.user.findManyAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        ...(searchText && {
          OR: [
            { email: { contains: searchText, mode: 'insensitive' } },
            { name: { contains: searchText, mode: 'insensitive' } },
          ],
        }),
      },
    });

    return generatePaginationResponse(res, { page, limit });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  excludeUserFields<User, Key extends keyof User>(
    user: User,
    keys: Key[],
  ): Omit<User, Key> {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key as Key)),
    ) as Omit<User, Key>;
  }
}
