import { AppDataSource } from '@config/database';
import { Bot } from '@entities/Bot';
import { BaseRepository } from './BaseRepository';

export class BotRepository extends BaseRepository<Bot> {
  constructor() {
    super(AppDataSource.getRepository(Bot));
  }

  async findByIdWithRelations(id: string): Promise<Bot | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['posts', 'comments'],
    });
  }
}

export const botRepository = new BotRepository();
