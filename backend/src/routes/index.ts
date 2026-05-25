import { Router, Request, Response } from 'express';
import userRoutes from './user.routes';
import postRoutes from './post.routes';
import commentRoutes from './comment.routes';
import botRoutes from './bot.routes';

const router: Router = Router();

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Resource routes
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/posts/:postId/comments', commentRoutes);
router.use('/bots', botRoutes);

export default router;
