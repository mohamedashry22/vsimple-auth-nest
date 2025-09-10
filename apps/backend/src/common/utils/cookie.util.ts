import { Response, Request } from 'express';
import { randomBytes } from 'crypto';

const AUTH_COOKIE = 'access_token';
const CSRF_COOKIE = 'csrf_token';

export function setAuthCookie(res: Response, token: string, secure: boolean): string {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
    path: '/',
  });
  const csrf = randomBytes(24).toString('hex');
  res.cookie(CSRF_COOKIE, csrf, {
    httpOnly: false,
    secure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
    path: '/',
  });
  return csrf;
}

export function clearAuthCookie(res: Response, secure: boolean): void {
  res.clearCookie(AUTH_COOKIE, { httpOnly: true, secure, sameSite: 'lax', path: '/' });
  res.clearCookie(CSRF_COOKIE, { httpOnly: false, secure, sameSite: 'lax', path: '/' });
}

export function getAuthCookie(req: Request): string | null {
  return req.cookies?.[AUTH_COOKIE] ?? null;
}
