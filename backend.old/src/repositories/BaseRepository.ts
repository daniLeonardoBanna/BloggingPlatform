import {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  FindManyOptions,
} from 'typeorm';
import { AbstractEntity } from '@entities/AbstractEntity';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export abstract class BaseRepository<T extends AbstractEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findPaginated(
    page: number,
    limit: number,
    options?: FindManyOptions<T>,
  ): Promise<PaginatedResult<T>> {
    const [items, total] = await this.repository.findAndCount({
      ...options,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total };
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    await this.repository.update(id, data as never);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async hardDelete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({ where });
    return count > 0;
  }
}
