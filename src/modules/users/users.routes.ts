import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { requireAuth } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { NotFoundError } from '../../lib/errors';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) throw new NotFoundError('User not found');
    res.json(user);
  } catch (e) {
    next(e);
  }
});

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  photoUrl: z.string().url().nullable().optional(),
});

router.patch('/', validate(patchSchema), async (req, res, next) => {
  try {
    const data = req.body as z.infer<typeof patchSchema>;
    const user = await prisma.user.update({ where: { id: req.userId! }, data });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
