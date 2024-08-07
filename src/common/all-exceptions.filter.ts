import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

// Define an enum for Prisma error codes
enum PrismaErrorCodes {
  UniqueConstraintFailed = 'P2002',
  RecordNotFound = 'P2025',
}

// Function to get the error message and status based on the exception
function getPrismaErrorInfo(exception: Prisma.PrismaClientKnownRequestError): {
  message: string;
  status: HttpStatus;
} {
  switch (exception.code) {
    case PrismaErrorCodes.UniqueConstraintFailed:
      return {
        message:
          'Unique constraint failed on the field: ' + exception.meta.target,
        status: HttpStatus.CONFLICT,
      };
    case PrismaErrorCodes.RecordNotFound:
      return {
        message: `${exception.meta.modelName ?? 'Record'} not found`,
        status: HttpStatus.NOT_FOUND,
      };
    default:
      return {
        message: 'An unknown error occurred',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
  }
}
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      (Array.isArray(exception.response?.message)
        ? exception.response.message.join(', ')
        : exception.response?.message) || 'Internal server error';

    this.logger.error({ ...exception });

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const { message, status } = getPrismaErrorInfo(exception);
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
      return;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
