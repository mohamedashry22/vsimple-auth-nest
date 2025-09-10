import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isHttp
      ? (exception.getResponse() as { message?: string | string[] })?.message ?? exception.message
      : 'Internal Server Error';

    res.status(status).json({
      statusCode: status,
      path: req.originalUrl,
      method: req.method,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
