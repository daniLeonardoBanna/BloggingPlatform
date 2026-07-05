import { Expose } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export class CreateBotDto {
  @Expose()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @Expose()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  persona!: string;

  @Expose()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  instructions!: string;
}

export class UpdateBotDto {
  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  persona?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  instructions?: string;
}

export class BotQueryDto {
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

// ─── Response DTO ─────────────────────────────────────────────────────────────

export class BotResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  persona!: string;

  @Expose()
  instructions!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
