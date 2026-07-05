import { Router } from 'express';
import { userController } from '@controllers/UserController';
import { validateDto } from '@middleware/validate';
import {
  CreateUserDto,
  LoginDto,
  SignUpDto,
  UpdateUserDto,
  UserQueryDto,
} from '@dtos/UserDto';

const router: Router = Router();

/**
 * @route   POST /api/v1/users/signup
 * @desc    Sign up a new user
 */
router.post('/signup', validateDto(SignUpDto), userController.signUp);

/**
 * @route   POST /api/v1/users/login
 * @desc    Login a user
 */
router.post('/login', validateDto(LoginDto), userController.login);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (paginated)
 */
router.get('/', validateDto(UserQueryDto, 'query'), userController.getUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get a single user by ID
 */
router.get('/:id', userController.getUserById);

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user
 */
router.post('/', validateDto(CreateUserDto), userController.createUser);

/**
 * @route   PATCH /api/v1/users/:id
 * @desc    Update a user
 */
router.patch('/:id', validateDto(UpdateUserDto), userController.updateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Soft-delete a user
 */
router.delete('/:id', userController.deleteUser);

export default router;
