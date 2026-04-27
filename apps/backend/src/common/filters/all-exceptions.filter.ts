import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: any = exception;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = res.message || res;
      errorDetails = res.error || exception.name;
    } else if (exception instanceof Error) {
      message = exception.message;
      errorDetails = exception.name;
    }

    // In a real production app, we might want to suppress internal error details.
    response.status(status).json({
      success: false,
      error: message,
      statusCode: status,
      details: errorDetails
    });
  }
}
