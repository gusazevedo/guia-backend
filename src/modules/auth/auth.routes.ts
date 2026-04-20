import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate.middleware';
import { authWithApple, authWithGoogle } from './auth.service';

const router = Router();

const googleSchema = z.object({ idToken: z.string().min(1) });
const appleSchema = z.object({ idToken: z.string().min(1), name: z.string().optional() });

router.post('/google', validate(googleSchema), async (req, res, next) => {
  try {
    const { idToken } = req.body as z.infer<typeof googleSchema>;
    const result = await authWithGoogle(idToken);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post('/apple', validate(appleSchema), async (req, res, next) => {
  try {
    const { idToken, name } = req.body as z.infer<typeof appleSchema>;
    const result = await authWithApple(idToken, name);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
