import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { ValidationError } from '@utils/errors';

type ValidationTarget = 'body' | 'query' | 'params';

export const validateDto =
  <T extends object>(
    DtoClass: ClassConstructor<T>,
    target: ValidationTarget = 'body',
  ) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const input = plainToInstance(DtoClass, req[target], {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    const errors = await validate(input as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => ({
        field: err.property,
        constraints: Object.values(err.constraints || {}),
      }));
      return next(new ValidationError(formattedErrors));
    }

    req[target] = input as never;
    next();
  };
