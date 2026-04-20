import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import booksRoutes from './modules/books/books.routes';
import progressRoutes from './modules/progress/progress.routes';

export function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/auth', authRoutes);
  app.use('/me', usersRoutes);
  app.use('/books', booksRoutes);
  app.use('/progress', progressRoutes);

  app.use(errorHandler);

  return app;
}
