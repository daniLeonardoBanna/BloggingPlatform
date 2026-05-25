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

export class CreateCommentDto {
  @Expose()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content!: string;

  @Expose()
  @IsUUID()
  userId!: string;
}

export class UpdateCommentDto {
  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content?: string;
}

export class CommentQueryDto {
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
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export class CommentAuthorDto {
  @Expose()
  id!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;
}

export class CommentResponseDto {
  @Expose()
  id!: string;

  @Expose()
  content!: string;

  @Expose()
  @Type(() => CommentAuthorDto)
  author!: CommentAuthorDto;

  @Expose()
  postId!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
