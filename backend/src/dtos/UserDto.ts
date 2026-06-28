import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { UserRole } from '@entities/User';

// ─── Request DTOs ────────────────────────────────────────────────────────────

export class CreateUserDto {
  @Expose()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @Expose()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName!: string;

  @Expose()
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @Expose()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

export class UpdateUserDto {
  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UserQueryDto {
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
  @IsEnum(UserRole)
  role?: UserRole;
}

export class SignUpDto {
  @Expose()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;
}

export class LoginDto {
  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  password!: string;
}

// ─── Response DTO ─────────────────────────────────────────────────────────────
// Every field here is EXPLICITLY opted-in with @Expose().
// Any entity column NOT listed here is never sent to the client —
// even if new columns are added to the entity later.

export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: UserRole;

  @Expose()
  isActive!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  // password is intentionally absent — it will never appear in responses
}
