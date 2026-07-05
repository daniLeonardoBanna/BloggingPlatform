import { AppDataSource } from '@config/database';
import { Comment } from '@entities/Comment';
import { BaseRepository, PaginatedResult } from './BaseRepository';

export class CommentRepository extends BaseRepository<Comment> {
  constructor() {
    super(AppDataSource.getRepository(Comment));
  }

  async findByIdWithRelations(id: string): Promise<Comment | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
  }

  async findPaginatedByPost(
    postId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Comment>> {
    const [items, total] = await this.repository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.post', 'post')
      .where('comment.postId = :postId', { postId })
      .orderBy('comment.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items, total };
  }
}

export const commentRepository = new CommentRepository();
