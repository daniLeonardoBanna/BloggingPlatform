import { Expose, Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export class CreatePostDto {
  @Expose()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @Expose()
  @IsString()
  @MinLength(1)
  content!: string;

  @Expose()
  @IsUUID()
  userId!: string;
}

export class UpdatePostDto {
  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;
}

export class PostQueryDto {
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @Expose()
  @IsOptional()
  @IsUUID()
  userId?: string;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export class PostAuthorDto {
  @Expose()
  id!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;
}

export class PostResponseDto {
  @Expose()
  id!: string;

  @Expose()
  title!: string;

  @Expose()
  content!: string;

  @Expose()
  @Type(() => PostAuthorDto)
  author!: PostAuthorDto;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
