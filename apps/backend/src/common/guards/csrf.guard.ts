import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const cookie = req.cookies?.['csrf_token'];
    const headerValue = req.headers['x-csrf-token'];
    const header = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    if (!cookie || !header || cookie !== header) {
      throw new ForbiddenException('Invalid CSRF token');
    }
    return true;
  }
}