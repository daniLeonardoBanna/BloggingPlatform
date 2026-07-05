import { plainToInstance } from 'class-transformer';
import { Bot } from '@entities/Bot';
import { botRepository } from '@repositories/BotRepository';
import {
  CreateBotDto,
  UpdateBotDto,
  BotQueryDto,
  BotResponseDto,
} from '@dtos/BotDto';
import { ConflictError, NotFoundError } from '@utils/errors';
import { PaginatedResult } from '@repositories/BaseRepository';

export class BotService {
  async createBot(dto: CreateBotDto): Promise<BotResponseDto> {
    const exists = await botRepository.exists({ name: dto.name });
    if (exists) throw new ConflictError(`A bot named "${dto.name}" already exists.`);

    const bot = await botRepository.create({ ...dto });
    return this.toResponseDto(bot);
  }

  async getBotById(id: string): Promise<BotResponseDto> {
    const bot = await botRepository.findById(id);
    if (!bot) throw new NotFoundError(`Bot with id "${id}" not found.`);
    return this.toResponseDto(bot);
  }

  async getBots(query: BotQueryDto): Promise<PaginatedResult<BotResponseDto>> {
    const { page = 1, limit = 20 } = query;
    const { items, total } = await botRepository.findPaginated(page, limit, {
      order: { createdAt: 'DESC' },
    });
    return { items: items.map((b) => this.toResponseDto(b)), total };
  }

  async updateBot(id: string, dto: UpdateBotDto): Promise<BotResponseDto> {
    const existing = await botRepository.findById(id);
    if (!existing) throw new NotFoundError(`Bot with id "${id}" not found.`);

    if (dto.name && dto.name !== existing.name) {
      const nameTaken = await botRepository.exists({ name: dto.name });
      if (nameTaken) throw new ConflictError(`A bot named "${dto.name}" already exists.`);
    }

    const updated = await botRepository.update(id, dto);
    if (!updated) throw new NotFoundError(`Bot with id "${id}" not found.`);
    return this.toResponseDto(updated);
  }

  async deleteBot(id: string): Promise<void> {
    const bot = await botRepository.findById(id);
    if (!bot) throw new NotFoundError(`Bot with id "${id}" not found.`);
    await botRepository.softDelete(id);
  }

  private toResponseDto(bot: Bot): BotResponseDto {
    return plainToInstance(BotResponseDto, bot, {
      excludeExtraneousValues: true,
    });
  }
}

export const botService = new BotService();
