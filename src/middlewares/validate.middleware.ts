import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

type Source = 'body' | 'params' | 'query';

export function validate<T>(schema: ZodSchema<T>, source: Source = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(result.error);
    (req as Request & Record<Source, T>)[source] = result.data;
    next();
  };
}
