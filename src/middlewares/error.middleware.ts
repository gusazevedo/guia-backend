import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({ code: 'VALIDATION_ERROR', errors: err.flatten() });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.status).json({ code: err.code, message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
}
