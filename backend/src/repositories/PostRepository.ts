import { Post } from '@entities/Post';
import { BaseRepository, PaginatedResult } from './BaseRepository';
import { AppDataSource } from '@config/database';

export class PostRepository extends BaseRepository<Post> {
  constructor() {
    super(AppDataSource.getRepository(Post));
  }

  async findByIdWithAuthor(id: string): Promise<Post | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findPaginatedWithAuthor(
    page: number,
    limit: number,
    userId?: string,
  ): Promise<PaginatedResult<Post>> {
    const qb = this.repository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (userId) {
      qb.where('user.id = :userId', { userId });
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
}

export const postRepository = new PostRepository();
