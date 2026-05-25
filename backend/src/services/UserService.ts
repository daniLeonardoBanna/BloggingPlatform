import { plainToInstance } from 'class-transformer';
import { User } from '@entities/User';
import { userRepository } from '@repositories/UserRepository';
import {
  CreateUserDto,
  UpdateUserDto,
  UserQueryDto,
  UserResponseDto,
} from '@dtos/UserDto';
import { ConflictError, NotFoundError } from '@utils/errors';
import { PaginatedResult } from '@repositories/BaseRepository';

export class UserService {
  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await userRepository.findByEmail(dto.email);

    if (exists)
      throw new ConflictError('A user with that email already exists.');

    // NOTE: In real apps, hash the password here (e.g. bcrypt)
    const user = await userRepository.create({ ...dto });
    return this.toResponseDto(user);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError(`User with id "${id}" not found.`);
    return this.toResponseDto(user);
  }

  async getUsers(
    query: UserQueryDto,
  ): Promise<PaginatedResult<UserResponseDto>> {
    const { page = 1, limit = 20, role } = query;
    const { items, total } = await userRepository.findPaginated(page, limit, {
      where: role ? { role } : undefined,
      order: { createdAt: 'DESC' },
    });
    return { items: items.map((u) => this.toResponseDto(u)), total };
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    // getUserById already throws NotFoundError if missing
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError(`User with id "${id}" not found.`);

    if (dto.email && dto.email !== existing.email) {
      const emailTaken = await userRepository.exists({ email: dto.email });
      if (emailTaken) throw new ConflictError('Email is already in use.');
    }

    const updated = await userRepository.update(id, dto);
    if (!updated) throw new NotFoundError(`User with id "${id}" not found.`);
    return this.toResponseDto(updated);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError(`User with id "${id}" not found.`);
    await userRepository.softDelete(id);
  }

  // Transforms a raw User entity → UserResponseDto.
  // `excludeExtraneousValues: true` means ONLY fields decorated with
  // @Expose() in UserResponseDto are included. Anything else (password,
  // deletedAt, future columns) is silently dropped.
  private toResponseDto(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}

export const userService = new UserService();
