import { Router } from 'express';
import { prisma } from '../../db/prisma';
import { requireAuth } from '../../middlewares/auth.middleware';
import { NotFoundError } from '../../lib/errors';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const books = await prisma.book.findMany({ orderBy: { id: 'asc' } });
    res.json(books);
  } catch (e) {
    next(e);
  }
});

router.get('/:slug', requireAuth, async (req, res, next) => {
  try {
    const slug = String(req.params.slug);
    const book = await prisma.book.findUnique({ where: { slug } });
    if (!book) throw new NotFoundError('Book not found');

    const readings = await prisma.chapterRead.findMany({
      where: { userId: req.userId!, bookId: book.id },
      select: { chapter: true, readAt: true },
      orderBy: { chapter: 'asc' },
    });

    res.json({
      ...book,
      readChapters: readings.map((r) => r.chapter),
      readings,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
