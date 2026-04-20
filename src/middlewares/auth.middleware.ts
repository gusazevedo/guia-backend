import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../lib/jwt';
import { UnauthorizedError } from '../lib/errors';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing bearer token'));
  }
  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyJwt(token);
    req.userId = payload.sub;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
