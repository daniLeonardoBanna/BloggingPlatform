import { Response } from 'express';
import { HttpStatus } from './errors';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: object[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = HttpStatus.OK,
  meta?: PaginationMeta
): Response => {
  const body: ApiResponse<T> = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
};

export const sendCreated = <T>(res: Response, data: T, message = 'Created'): Response =>
  sendSuccess(res, data, message, HttpStatus.CREATED);

export const sendNoContent = (res: Response): Response =>
  res.status(HttpStatus.NO_CONTENT).send();

export const sendError = (
  res: Response,
  message: string,
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  errors?: object[]
): Response => {
  const body: ApiResponse = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

export const paginate = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
