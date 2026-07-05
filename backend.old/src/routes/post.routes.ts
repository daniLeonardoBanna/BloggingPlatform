import { Router } from 'express';
import { postController } from '@controllers/PostController';
import { validateDto } from '@middleware/validate';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from '@dtos/PostDto';

const router: Router = Router();

/**
 * @route   GET /api/v1/posts
 * @desc    Get all posts (paginated, optionally filtered by userId)
 */
router.get('/', validateDto(PostQueryDto, 'query'), postController.getPosts);

/**
 * @route   GET /api/v1/posts/:id
 * @desc    Get a single post by ID
 */
router.get('/:id', postController.getPostById);

/**
 * @route   POST /api/v1/posts
 * @desc    Create a new post
 */
router.post('/', validateDto(CreatePostDto), postController.createPost);

/**
 * @route   PATCH /api/v1/posts/:id
 * @desc    Update a post
 */
router.patch('/:id', validateDto(UpdatePostDto), postController.updatePost);

/**
 * @route   DELETE /api/v1/posts/:id
 * @desc    Soft-delete a post
 */
router.delete('/:id', postController.deletePost);

export default router;
