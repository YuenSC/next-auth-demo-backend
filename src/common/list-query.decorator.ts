import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export interface ListQueryParams {
  searchText?: string;
  limit: number;
  page: number;
}

export const ListQuery = createParamDecorator(
  (data: { defaultLimit?: number }, ctx: ExecutionContext): ListQueryParams => {
    const request = ctx.switchToHttp().getRequest();
    const {
      searchText,
      limit = data?.defaultLimit ?? 10,
      page = 1,
    } = request.query;
    if (page <= 0) {
      throw new BadRequestException('Page must be greater than or equal to 1');
    }
    if (limit < 0) {
      throw new BadRequestException('Limit must be greater than or equal to 0');
    }

    return {
      searchText,
      limit: Number(limit),
      page: Number(page),
    };
  },
);
