import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import authJwtConfig from './configs/auth-jwt.config';
import envFilePath from './configs/envFilePath';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { TransformInterceptor } from './transform.interceptor';
import { ProjectsModule } from './modules/projects/projects.module';
import { TimeEntryModule } from './modules/time-entry/time-entry.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authJwtConfig],
      envFilePath: envFilePath,
    }),
    ProjectsModule,
    TimeEntryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
