import { Response } from 'express';
import { postService } from '@services/PostService';
import { sendSuccess, sendCreated, sendNoContent, paginate } from '@utils/response';
import { asyncHandler } from '@middleware/errorHandler';
import {
  GetPostsRequest,
  GetPostByIdRequest,
  CreatePostRequest,
  UpdatePostRequest,
  DeletePostRequest,
} from '../types/express.d';

export class PostController {
  getPosts = asyncHandler(async (req: GetPostsRequest, res: Response) => {
    const { page = 1, limit = 20 } = req.query;
    const { items, total } = await postService.getPosts(req.query);
    const meta = paginate(page, limit, total);
    return sendSuccess(res, items, 'Posts retrieved.', 200, meta);
  });

  getPostById = asyncHandler(async (req: GetPostByIdRequest, res: Response) => {
    const post = await postService.getPostById(req.params.id);
    return sendSuccess(res, post, 'Post retrieved.');
  });

  createPost = asyncHandler(async (req: CreatePostRequest, res: Response) => {
    const post = await postService.createPost(req.body);
    return sendCreated(res, post, 'Post created.');
  });

  updatePost = asyncHandler(async (req: UpdatePostRequest, res: Response) => {
    const post = await postService.updatePost(req.params.id, req.body);
    return sendSuccess(res, post, 'Post updated.');
  });

  deletePost = asyncHandler(async (req: DeletePostRequest, res: Response) => {
    await postService.deletePost(req.params.id);
    return sendNoContent(res);
  });
}

export const postController = new PostController();
