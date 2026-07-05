import { Router } from 'express';
import { commentController } from '@controllers/CommentController';
import { validateDto } from '@middleware/validate';
import { CreateCommentDto, UpdateCommentDto, CommentQueryDto } from '@dtos/CommentDto';

// mergeParams allows access to :postId from the parent router
const router: Router = Router({ mergeParams: true });

/**
 * @route   GET /api/v1/posts/:postId/comments
 * @desc    Get all comments for a post (paginated)
 */
router.get('/', validateDto(CommentQueryDto, 'query'), commentController.getComments);

/**
 * @route   GET /api/v1/posts/:postId/comments/:id
 * @desc    Get a single comment by ID
 */
router.get('/:id', commentController.getCommentById);

/**
 * @route   POST /api/v1/posts/:postId/comments
 * @desc    Create a new comment on a post
 */
router.post('/', validateDto(CreateCommentDto), commentController.createComment);

/**
 * @route   PATCH /api/v1/posts/:postId/comments/:id
 * @desc    Update a comment
 */
router.patch('/:id', validateDto(UpdateCommentDto), commentController.updateComment);

/**
 * @route   DELETE /api/v1/posts/:postId/comments/:id
 * @desc    Soft-delete a comment
 */
router.delete('/:id', commentController.deleteComment);

export default router;
