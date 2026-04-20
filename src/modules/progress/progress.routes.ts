import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { BadRequestError, NotFoundError } from '../../lib/errors';

const router = Router();

router.use(requireAuth);

const paramsSchema = z.object({
  bookId: z.coerce.number().int().positive(),
  chapter: z.coerce.number().int().positive(),
});

async function assertChapterExists(bookId: number, chapter: number) {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new NotFoundError('Book not found');
  if (chapter < 1 || chapter > book.chapters) {
    throw new BadRequestError(`Chapter must be between 1 and ${book.chapters}`);
  }
  return book;
}

router.post('/:bookId/:chapter', validate(paramsSchema, 'params'), async (req, res, next) => {
  try {
    const { bookId, chapter } = req.params as unknown as z.infer<typeof paramsSchema>;
    await assertChapterExists(bookId, chapter);
    const reading = await prisma.chapterRead.upsert({
      where: { userId_bookId_chapter: { userId: req.userId!, bookId, chapter } },
      update: {},
      create: { userId: req.userId!, bookId, chapter },
    });
    res.status(201).json(reading);
  } catch (e) {
    next(e);
  }
});

router.delete('/:bookId/:chapter', validate(paramsSchema, 'params'), async (req, res, next) => {
  try {
    const { bookId, chapter } = req.params as unknown as z.infer<typeof paramsSchema>;
    await prisma.chapterRead
      .delete({
        where: { userId_bookId_chapter: { userId: req.userId!, bookId, chapter } },
      })
      .catch(() => null);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

router.get('/summary', async (req, res, next) => {
  try {
    const [books, readings] = await Promise.all([
      prisma.book.findMany({ orderBy: { id: 'asc' } }),
      prisma.chapterRead.findMany({
        where: { userId: req.userId! },
        select: { bookId: true, chapter: true },
      }),
    ]);

    const byBook = new Map<number, Set<number>>();
    for (const r of readings) {
      if (!byBook.has(r.bookId)) byBook.set(r.bookId, new Set());
      byBook.get(r.bookId)!.add(r.chapter);
    }

    const perBook = books.map((b) => {
      const read = byBook.get(b.id)?.size ?? 0;
      return {
        bookId: b.id,
        slug: b.slug,
        name: b.name,
        testament: b.testament,
        totalChapters: b.chapters,
        readChapters: read,
        completed: read === b.chapters,
      };
    });

    const totalChapters = books.reduce((acc, b) => acc + b.chapters, 0);
    const totalRead = perBook.reduce((acc, b) => acc + b.readChapters, 0);
    const booksCompleted = perBook.filter((b) => b.completed).length;

    res.json({
      totalChapters,
      totalRead,
      percent: totalChapters === 0 ? 0 : Number(((totalRead / totalChapters) * 100).toFixed(2)),
      booksCompleted,
      booksTotal: books.length,
      books: perBook,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
