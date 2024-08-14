import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ListQueryParams {
  searchText?: string;
  page: number;
  offset: number;
}

export const ListQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ListQueryParams => {
    const request = ctx.switchToHttp().getRequest();
    const { searchText, page = 1, offset = 10 } = request.query;
    return {
      searchText,
      page: Number(page),
      offset: Number(offset),
    };
  },
);
