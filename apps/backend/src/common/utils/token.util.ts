import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;
  email: string;
}

export function signToken(jwt: JwtService, payload: JwtPayload): string {
  return jwt.sign(payload, { expiresIn: '1h' });
}

export function verifyToken(jwt: JwtService, token: string): JwtPayload {
  return jwt.verify<JwtPayload>(token);
}
