import { plainToInstance } from 'class-transformer';
import { Post } from '@entities/Post';
import { postRepository } from '@repositories/PostRepository';
import { userRepository } from '@repositories/UserRepository';
import {
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
  PostResponseDto,
} from '@dtos/PostDto';
import { NotFoundError } from '@utils/errors';
import { PaginatedResult } from '@repositories/BaseRepository';

export class PostService {
  async createPost(dto: CreatePostDto): Promise<PostResponseDto> {
    const user = await userRepository.findById(dto.userId);
    if (!user)
      throw new NotFoundError(`User with id "${dto.userId}" not found.`);

    const post = await postRepository.create({
      title: dto.title,
      content: dto.content,
      user,
    });
    return this.toResponseDto(post);
  }

  async getPostById(id: string): Promise<PostResponseDto> {
    const post = await postRepository.findByIdWithAuthor(id);
    if (!post) throw new NotFoundError(`Post with id "${id}" not found.`);
    return this.toResponseDto(post);
  }

  async getPosts(
    query: PostQueryDto,
  ): Promise<PaginatedResult<PostResponseDto>> {
    const { page = 1, limit = 20, userId } = query;
    const { items, total } = await postRepository.findPaginatedWithAuthor(
      page,
      limit,
      userId,
    );
    return { items: items.map((p) => this.toResponseDto(p)), total };
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<PostResponseDto> {
    const post = await postRepository.findById(id);
    if (!post) throw new NotFoundError(`Post with id "${id}" not found.`);

    await postRepository.update(id, dto);
    return this.toResponseDto(post!);
  }

  async deletePost(id: string): Promise<void> {
    const post = await postRepository.findById(id);
    if (!post) throw new NotFoundError(`Post with id "${id}" not found.`);
    await postRepository.softDelete(id);
  }

  private toResponseDto(post: Post): PostResponseDto {
    return plainToInstance(
      PostResponseDto,
      { ...post, author: post.user },
      { excludeExtraneousValues: true },
    );
  }
}

export const postService = new PostService();
