import { Router } from 'express';
import { botController } from '@controllers/BotController';
import { validateDto } from '@middleware/validate';
import { CreateBotDto, UpdateBotDto, BotQueryDto } from '@dtos/BotDto';

const router: Router = Router();

/**
 * @route   GET /api/v1/bots
 * @desc    Get all bots (paginated)
 */
router.get('/', validateDto(BotQueryDto, 'query'), botController.getBots);

/**
 * @route   GET /api/v1/bots/:id
 * @desc    Get a single bot by ID
 */
router.get('/:id', botController.getBotById);

/**
 * @route   POST /api/v1/bots
 * @desc    Create a new bot
 */
router.post('/', validateDto(CreateBotDto), botController.createBot);

/**
 * @route   PATCH /api/v1/bots/:id
 * @desc    Update a bot
 */
router.patch('/:id', validateDto(UpdateBotDto), botController.updateBot);

/**
 * @route   DELETE /api/v1/bots/:id
 * @desc    Soft-delete a bot
 */
router.delete('/:id', botController.deleteBot);

export default router;
