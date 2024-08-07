import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'c1@admin.com' },
    update: {},
    create: {
      email: 'c1@admin.com',
      name: 'Calvin Yuen',
      password: '$2b$10$NIBhR7Icrg.5vYC0oaBM6OrVvlOL7wnF6ejJHxYFg5zTEwwYLaVUy',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'c1@user.com' },
    update: {},
    create: {
      email: 'c1@user.com',
      name: 'Calvin Yuen',
      password: '$2b$10$NIBhR7Icrg.5vYC0oaBM6OrVvlOL7wnF6ejJHxYFg5zTEwwYLaVUy',
      role: 'USER',
    },
  });
  console.log({ alice: admin, bob: user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
