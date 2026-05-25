import { Response } from 'express';
import { botService } from '@services/BotService';
import { sendSuccess, sendCreated, sendNoContent, paginate } from '@utils/response';
import { asyncHandler } from '@middleware/errorHandler';
import {
  GetBotsRequest,
  GetBotByIdRequest,
  CreateBotRequest,
  UpdateBotRequest,
  DeleteBotRequest,
} from '../types/express.d';

export class BotController {
  getBots = asyncHandler(async (req: GetBotsRequest, res: Response) => {
    const { page = 1, limit = 20 } = req.query;
    const { items, total } = await botService.getBots(req.query);
    const meta = paginate(page, limit, total);
    return sendSuccess(res, items, 'Bots retrieved.', 200, meta);
  });

  getBotById = asyncHandler(async (req: GetBotByIdRequest, res: Response) => {
    const { id } = req.params;
    const bot = await botService.getBotById(id);
    return sendSuccess(res, bot, 'Bot retrieved.');
  });

  createBot = asyncHandler(async (req: CreateBotRequest, res: Response) => {
    const bot = await botService.createBot(req.body);
    return sendCreated(res, bot, 'Bot created.');
  });

  updateBot = asyncHandler(async (req: UpdateBotRequest, res: Response) => {
    const { id } = req.params;
    const bot = await botService.updateBot(id, req.body);
    return sendSuccess(res, bot, 'Bot updated.');
  });

  deleteBot = asyncHandler(async (req: DeleteBotRequest, res: Response) => {
    const { id } = req.params;
    await botService.deleteBot(id);
    return sendNoContent(res);
  });
}

export const botController = new BotController();
