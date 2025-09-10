import { Request } from 'express';
import { JwtPayload } from '../utils/token.util';

export interface RequestWithUser extends Request {
  auth?: JwtPayload;
}
