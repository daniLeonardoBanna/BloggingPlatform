# Express API Template

Production-ready Express API with **TypeScript**, **TypeORM**, and **PostgreSQL**.

## Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Runtime    | Node.js + TypeScript                |
| Framework  | Express                             |
| ORM        | TypeORM                             |
| Database   | PostgreSQL                          |
| Validation | class-validator + class-transformer |
| Logging    | Winston + Morgan                    |
| Security   | Helmet, CORS, express-rate-limit    |

## Project Structure

```
src/
├── config/
│   ├── database.ts      # TypeORM DataSource
│   └── env.ts           # Typed environment variables
├── controllers/         # Route handlers (thin layer)
├── entities/            # TypeORM entities
│   └── AbstractEntity.ts  # Base entity (uuid, timestamps, soft-delete)
├── middleware/
│   ├── errorHandler.ts  # Global error handler + asyncHandler wrapper
│   ├── requestLogger.ts # Morgan HTTP logging
│   └── validate.ts      # class-validator DTO middleware
├── repositories/        # Data access layer
│   └── BaseRepository.ts  # Generic CRUD + pagination
├── routes/              # Express routers
├── services/            # Business logic layer
├── types/               # DTOs (Data Transfer Objects)
└── utils/
    ├── errors.ts        # Custom error classes
    ├── logger.ts        # Winston logger
    └── response.ts      # Standardised API response helpers
```

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Set environment variables
cp .env.example .env
# Edit .env with your database credentials

# 3. Run migrations
pnpm run migration:run

# 4. Start development server
pnpm run dev
```

## API Conventions

All responses follow this envelope:

```json
{
  "success": true,
  "message": "Users retrieved.",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Adding a New Resource

1. Create an **entity** in `src/entities/`
2. Create a **repository** extending `BaseRepository` in `src/repositories/`
3. Create **DTOs** (request/response shapes) in `src/types/`
4. Create a **service** with business logic in `src/services/`
5. Create a **controller** in `src/controllers/`
6. Create a **router** in `src/routes/` and register it in `src/routes/index.ts`

## Environment Variables

See `.env.example` for all available configuration options.

## Database Migrations

Migrations are the safe, versioned way to evolve your DB schema. Each migration file has two methods:

- **`up()`** — applies the change (e.g. `ALTER TABLE ... ADD COLUMN`)
- **`down()`** — reverts it (e.g. `ALTER TABLE ... DROP COLUMN`)

TypeORM tracks executed migrations in a `migrations` table it manages automatically.

> **Important:** Keep `DB_SYNCHRONIZE=false` in your `.env`. If `synchronize` is `true`, TypeORM silently alters the DB on startup and migrations become meaningless.

### Walkthrough: Adding a new column

**1. Update the entity**

Add the new field to the relevant entity. Use `nullable: true` when adding a column to a table that already has rows — a non-nullable column with no default would cause the migration to fail.

```typescript
// src/entities/User.ts
export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('users')
export class User extends AbstractEntity {
  // ...existing columns...

  @Column({ type: 'enum', enum: UserGender, nullable: true })
  gender?: UserGender;
}
```

**2. Generate the migration**

TypeORM diffs the live DB schema against your entities and writes the SQL for you:

```bash
pnpm run migration:generate src/migrations/AddGenderToUser
```

This creates a timestamped file like `src/migrations/1748150000000-AddGenderToUser.ts`:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGenderToUser1748150000000 implements MigrationInterface {
  name = 'AddGenderToUser1748150000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female', 'other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "gender" "public"."users_gender_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
  }
}
```

Always review the generated file — especially `down()` — before running it.

**3. Run the migration**

```bash
pnpm run migration:run
```

TypeORM finds all pending migrations (not yet recorded in the `migrations` table) and executes their `up()` methods in timestamp order.

**4. Revert if needed**

```bash
pnpm run migration:revert
```

Runs the `down()` of the most recently applied migration.

### Undoing a migration: should you delete the file?

| Situation                                         | What to do                                                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Migration only exists locally, never shared       | `migration:revert` → revert entity → delete file                                                |
| Migration was pushed to Git or run on a shared DB | Create a **new** migration that reverses the change — never delete a distributed migration file |

The rule mirrors Git: rewrite history locally, never once it's shared.

---

## Scripts

| Script                        | Description                            |
| ----------------------------- | -------------------------------------- |
| `pnpm run dev`                | Start dev server with hot reload       |
| `pnpm run build`              | Compile TypeScript                     |
| `pnpm start`                  | Start compiled server                  |
| `pnpm run migration:generate` | Generate migration from entity changes |
| `pnpm run migration:run`      | Run pending migrations                 |
| `pnpm run migration:revert`   | Revert last migration                  |
