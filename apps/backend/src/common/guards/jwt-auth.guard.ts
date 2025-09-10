import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getAuthCookie } from '../utils/cookie.util';
import { verifyToken } from '../utils/token.util';
import { RequestWithUser } from '../types/request-with-user';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const token = getAuthCookie(req);
    if (!token) throw new UnauthorizedException();

    try {
      req.auth = verifyToken(this.jwt, token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}