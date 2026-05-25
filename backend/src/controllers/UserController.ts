import { Response, RequestHandler } from 'express';
import { userService } from '@services/UserService';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  paginate,
} from '@utils/response';
import { asyncHandler } from '@middleware/errorHandler';
import {
  GetUsersRequest,
  GetUserByIdRequest,
  CreateUserRequest,
  UpdateUserRequest,
  DeleteUserRequest,
} from '../types/express.d';

export class UserController {
  // req.query is already UserQueryDto — typed by GetUsersRequest
  getUsers = asyncHandler(async (req: GetUsersRequest, res: Response) => {
    const { page = 1, limit = 20 } = req.query;
    const { items, total } = await userService.getUsers(req.query);
    const meta = paginate(page, limit, total);
    return sendSuccess(res, items, 'Users retrieved.', 200, meta);
  });

  // req.params.id is typed as string — no casting needed
  getUserById = asyncHandler(async (req: GetUserByIdRequest, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, user, 'User retrieved.');
  });

  // req.body is already CreateUserDto — set by the validateDto middleware
  createUser = asyncHandler(async (req: CreateUserRequest, res: Response) => {
    const user = await userService.createUser(req.body);
    return sendCreated(res, user, 'User created.');
  });

  // req.body is UpdateUserDto, req.params.id is string
  updateUser = asyncHandler(async (req: UpdateUserRequest, res: Response) => {
    const user = await userService.updateUser(req.params.id, req.body);
    return sendSuccess(res, user, 'User updated.');
  });

  deleteUser = asyncHandler(async (req: DeleteUserRequest, res: Response) => {
    await userService.deleteUser(req.params.id);
    return sendNoContent(res);
  });
}

export const userController = new UserController();
