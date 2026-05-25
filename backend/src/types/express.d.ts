import { Request } from 'express';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from '@dtos/UserDto';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from '@dtos/PostDto';
import { CreateCommentDto, UpdateCommentDto, CommentQueryDto } from '@dtos/CommentDto';
import { CreateBotDto, UpdateBotDto, BotQueryDto } from '@dtos/BotDto';

// Use Express's built-in Request generics:
//   Request<Params, ResBody, ReqBody, ReqQuery>
// This is the correct way to type routes — no interface extension needed,
// no `as` casting needed in controllers.

export type GetUsersRequest      = Request<Record<string, never>, unknown, unknown, UserQueryDto>;
export type GetUserByIdRequest   = Request<{ id: string }>;
export type CreateUserRequest    = Request<Record<string, never>, unknown, CreateUserDto>;
export type UpdateUserRequest    = Request<{ id: string }, unknown, UpdateUserDto>;
export type DeleteUserRequest    = Request<{ id: string }>;

export type GetPostsRequest      = Request<Record<string, never>, unknown, unknown, PostQueryDto>;
export type GetPostByIdRequest   = Request<{ id: string }>;
export type CreatePostRequest    = Request<Record<string, never>, unknown, CreatePostDto>;
export type UpdatePostRequest    = Request<{ id: string }, unknown, UpdatePostDto>;
export type DeletePostRequest    = Request<{ id: string }>;

export type GetCommentsRequest      = Request<{ postId: string }, unknown, unknown, CommentQueryDto>;
export type GetCommentByIdRequest   = Request<{ postId: string; id: string }>;
export type CreateCommentRequest    = Request<{ postId: string }, unknown, CreateCommentDto>;
export type UpdateCommentRequest    = Request<{ postId: string; id: string }, unknown, UpdateCommentDto>;
export type DeleteCommentRequest    = Request<{ postId: string; id: string }>;

export type GetBotsRequest      = Request<Record<string, never>, unknown, unknown, BotQueryDto>;
export type GetBotByIdRequest   = Request<{ id: string }>;
export type CreateBotRequest    = Request<Record<string, never>, unknown, CreateBotDto>;
export type UpdateBotRequest    = Request<{ id: string }, unknown, UpdateBotDto>;
export type DeleteBotRequest    = Request<{ id: string }>;
