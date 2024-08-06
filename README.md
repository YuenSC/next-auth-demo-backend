# Roadmap

1. Create a user model by Prisma
2. Provide User CRUD operations
3. Add authentication and authorization using Passport for credential login, Google login, and Apple login
4. Add role-based access control - Admin (mutate + view), User (view)

## Table of Contents

- [Step 1: Create a user model by Prisma](#step-1-create-a-user-model-by-prisma)
  - [1.1 Install Prisma](#11-install-prisma)
  - [1.2 Install Docker Compose and Run the Database Locally](#12-install-docker-compose-and-run-the-database-locally)
  - [1.3 Create a User Model](#13-create-a-user-model)

## Step 1: Create a user model by Prisma

Ref: [NestJS Prisma Recipe](https://docs.nestjs.com/recipes/prisma)

### 1.1 Install Prisma

```sh
npm install prisma --save-dev
npx prisma init
```

Update the In [`schema.prisma`](prisma\schema.prisma) to use SQLite:

```prisma
datasource db {
  provider = "sqlite"
  url      =  env("DATABASE_URL")
}
```

```
DATABASE_URL=file:./dev.db
```

### 1.2 Create a User Model

In [`schema.prisma`](prisma\schema.prisma):

```prisma
model User {
  id       Int     @default(autoincrement()) @id
  email    String  @unique
  name     String?
  password String?
}
```

### 1.3 Run Prisma Migrate

```sh
npx prisma migrate dev --name init
```

### 1.4 Follow the [NestJS Prisma Recipe](https://docs.nestjs.com/recipes/prisma)

The rest are sample, following the docs should be enough to generate the CRUD operations.

- Install and generate Prisma Client
- Use Prisma Client in your NestJS services - Create PrismaService
- Run nest g resource user for CRUD operations - Update the service to use PrismaService
