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

### 1.2 Install Docker Compose and Run the Database Locally

Create a [`docker-compose.yml`](./docker-compose.yml) file with the following content:

```yaml
services:
  postgres:
    image: postgres
    restart: always
    ports:
      - 5432:5432
    volumes:
      - ~/apps/postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=next-auth-demo-backend
      - POSTGRES_PASSWORD=example
      - POSTGRES_USER=root
```

Then open Docker Desktop and run the following command:

```sh
docker-compose up -d
```

Update the DATABASE_URL in the [`.env`](.env) file with the correct format:

```
DATABASE_URL=postgresql://root:example@localhost:5432/next-auth-demo-backend?schema=public
```

### 1.3 Create a User Model

In [`schema.prisma`](prisma\schema.prisma):

```prisma
model User {
  id       Int     @default(autoincrement()) @id
  email    String  @unique
  name     String?
  password String?
}
```

### 1.5 Follow the [NestJS Prisma Recipe](https://docs.nestjs.com/recipes/prisma)

The rest are sample, following the docs should be enough to generate the CRUD operations.

- Install and generate Prisma Client
- Use Prisma Client in your NestJS services - Create PrismaService
- Run nest g resource user for CRUD operations - Update the service to use PrismaService
