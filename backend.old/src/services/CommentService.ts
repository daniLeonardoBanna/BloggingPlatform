import { plainToInstance } from 'class-transformer';
import { Comment } from '@entities/Comment';
import { commentRepository } from '@repositories/CommentRepository';
import { postRepository } from '@repositories/PostRepository';
import { userRepository } from '@repositories/UserRepository';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentQueryDto,
  CommentResponseDto,
} from '@dtos/CommentDto';
import { NotFoundError } from '@utils/errors';
import { PaginatedResult } from '@repositories/BaseRepository';

export class CommentService {
  async createComment(
    postId: string,
    dto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const post = await postRepository.findById(postId);
    if (!post) throw new NotFoundError(`Post with id "${postId}" not found.`);

    const user = await userRepository.findById(dto.userId);
    if (!user)
      throw new NotFoundError(`User with id "${dto.userId}" not found.`);

    const comment = await commentRepository.create({
      content: dto.content,
      post,
      user,
    });

    const withRelations = await commentRepository.findByIdWithRelations(
      comment.id,
    );
    return this.toResponseDto(withRelations!);
  }

  async getCommentById(
    postId: string,
    id: string,
  ): Promise<CommentResponseDto> {
    const comment = await commentRepository.findByIdWithRelations(id);
    if (!comment || comment.post.id !== postId) {
      throw new NotFoundError(`Comment with id "${id}" not found.`);
    }
    return this.toResponseDto(comment);
  }

  async getComments(
    postId: string,
    query: CommentQueryDto,
  ): Promise<PaginatedResult<CommentResponseDto>> {
    const post = await postRepository.findById(postId);
    if (!post) throw new NotFoundError(`Post with id "${postId}" not found.`);

    const { page = 1, limit = 20 } = query;
    const { items, total } = await commentRepository.findPaginatedByPost(
      postId,
      page,
      limit,
    );
    return { items: items.map((c) => this.toResponseDto(c)), total };
  }

  async updateComment(
    postId: string,
    id: string,
    dto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = await commentRepository.findByIdWithRelations(id);
    if (!comment || comment.post.id !== postId) {
      throw new NotFoundError(`Comment with id "${id}" not found.`);
    }

    await commentRepository.update(id, dto);
    const updated = await commentRepository.findByIdWithRelations(id);
    return this.toResponseDto(updated!);
  }

  async deleteComment(postId: string, id: string): Promise<void> {
    const comment = await commentRepository.findByIdWithRelations(id);
    if (!comment || comment.post.id !== postId) {
      throw new NotFoundError(`Comment with id "${id}" not found.`);
    }
    await commentRepository.softDelete(id);
  }

  private toResponseDto(comment: Comment): CommentResponseDto {
    return plainToInstance(
      CommentResponseDto,
      {
        ...comment,
        author: comment.user,
        postId: comment.post.id,
      },
      { excludeExtraneousValues: true },
    );
  }
}

export const commentService = new CommentService();
