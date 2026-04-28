import express from 'express';
import { env } from './config/env';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import booksRoutes from './modules/books/books.routes';
import progressRoutes from './modules/progress/progress.routes';
import { openApiSpec } from './docs/openapi';

export function buildApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

  app.use('/auth', authRoutes);
  app.use('/me', usersRoutes);
  app.use('/books', booksRoutes);
  app.use('/progress', progressRoutes);

  app.use(errorHandler);

  return app;
}
