// src/prisma/extensions/find-many-count.extension.ts

import { Prisma } from '@prisma/client';

type FindManyAndCountResult<T> = [T[], number];

export const findManyAndCountExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'findManyAndCount',
    model: {
      $allModels: {
        async findManyAndCount<
          TModel,
          TArgs extends Prisma.Args<TModel, 'findMany'>,
        >(
          this: TModel,
          args?: Prisma.Exact<TArgs, Prisma.Args<TModel, 'findMany'>>,
        ): Promise<
          FindManyAndCountResult<Prisma.Result<TModel, TArgs, 'findMany'>>
        > {
          const context = Prisma.getExtensionContext(this);

          const [records, totalRecords] = await client.$transaction([
            (context as any).findMany(args),
            (context as any).count({ where: (args as any)?.where }),
          ]);

          return [records, totalRecords];
        },
      },
    },
  });
});
