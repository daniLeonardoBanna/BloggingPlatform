import { Response } from 'express';
import { commentService } from '@services/CommentService';
import { sendSuccess, sendCreated, sendNoContent, paginate } from '@utils/response';
import { asyncHandler } from '@middleware/errorHandler';
import {
  GetCommentsRequest,
  GetCommentByIdRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  DeleteCommentRequest,
} from '../types/express.d';

export class CommentController {
  getComments = asyncHandler(async (req: GetCommentsRequest, res: Response) => {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const { items, total } = await commentService.getComments(postId, req.query);
    const meta = paginate(page, limit, total);
    return sendSuccess(res, items, 'Comments retrieved.', 200, meta);
  });

  getCommentById = asyncHandler(async (req: GetCommentByIdRequest, res: Response) => {
    const { postId, id } = req.params;
    const comment = await commentService.getCommentById(postId, id);
    return sendSuccess(res, comment, 'Comment retrieved.');
  });

  createComment = asyncHandler(async (req: CreateCommentRequest, res: Response) => {
    const { postId } = req.params;
    const comment = await commentService.createComment(postId, req.body);
    return sendCreated(res, comment, 'Comment created.');
  });

  updateComment = asyncHandler(async (req: UpdateCommentRequest, res: Response) => {
    const { postId, id } = req.params;
    const comment = await commentService.updateComment(postId, id, req.body);
    return sendSuccess(res, comment, 'Comment updated.');
  });

  deleteComment = asyncHandler(async (req: DeleteCommentRequest, res: Response) => {
    const { postId, id } = req.params;
    await commentService.deleteComment(postId, id);
    return sendNoContent(res);
  });
}

export const commentController = new CommentController();
