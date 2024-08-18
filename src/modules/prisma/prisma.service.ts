import { Injectable, OnModuleInit } from '@nestjs/common';
import { ExtendedPrismaClient } from './extended-client';

@Injectable()
export class PrismaService
  extends ExtendedPrismaClient
  implements OnModuleInit
{
  constructor() {
    super({
      omit: {
        user: {
          password: true,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
