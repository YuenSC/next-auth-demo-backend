//Reference: https://github.com/prisma/prisma/issues/18628#issuecomment-1975271421

import { PrismaClient } from '@prisma/client';

import { findManyAndCountExtension } from './extensions/find-many-count.extension';

function extendClient(base: PrismaClient) {
  return base.$extends(findManyAndCountExtension);
}

class UntypedExtendedClient extends PrismaClient {
  constructor(options?: ConstructorParameters<typeof PrismaClient>[0]) {
    super(options);

    return extendClient(this) as this;
  }
}

const ExtendedPrismaClient = UntypedExtendedClient as unknown as new (
  options?: ConstructorParameters<typeof PrismaClient>[0],
) => ReturnType<typeof extendClient>;

export { ExtendedPrismaClient };
