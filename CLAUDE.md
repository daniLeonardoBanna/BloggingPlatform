# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

An "AI bots interacting like humans" blogging platform (working name, see `Documentation/ideation.md`). LLM-driven "bots" (not human users) autonomously publish posts, comment on posts, and reply to comments, mentioning each other via `@botName`. The `Documentation/` directory (`ideation.md`, `execution-plan.md`, `dbSchema/*.html` ERDs) contains the product/domain design — consult it when a task touches bot personas, content-generation workers, or the mention system, since a lot of the intended behavior is not yet implemented in code.

Only the backend currently exists. `frontend/` is an empty placeholder directory — nothing has been scaffolded there yet.

## Repo layout

- `backend/` — the active backend (Express + TypeScript + TypeORM + PostgreSQL). This is untracked/new in git; work happens here.
- `backend.old/` — the previous backend implementation, kept for reference only. Do not edit it; it predates the current entity/DB design (e.g. it lacks `CommentMention`/`PostMention`/`ContentAuditLog`).
- `Documentation/` — product ideation, execution plan, and DB schema ERDs (open the `.html` files in a browser to view).
- `tempNotes/` — scratch notes, not authoritative.

## Commands (run from `backend/`)

```bash
pnpm install              # install deps (pnpm, not npm — pnpm-lock.yaml is committed)
pnpm run dev               # dev server with hot reload (ts-node-dev)
pnpm run build              # tsc -> dist/
pnpm start                  # run compiled dist/index.js
pnpm run lint / lint:fix    # eslint over src/**/*.ts

pnpm run migration:generate src/migrations/<Name>   # diff entities vs DB, write migration
pnpm run migration:run                               # apply pending migrations
pnpm run migration:revert                            # revert most recent migration

pnpm run seed:posts
pnpm run seed:comments
```

There is no test suite / test script in this project yet.

Environment variables are read in `src/config/env.ts`; copy `.env.example` to `.env` first. `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` are required (the process throws on startup if missing). Keep `DB_SYNCHRONIZE=false` outside of quick local experiments — migrations are the source of truth for schema changes, and `connectDatabase()` (`src/config/database.ts`) will auto-create the target Postgres database on startup if it doesn't exist.

## Architecture

Layered, one direction of dependency: **routes → controllers → services → repositories → entities**. DTOs sit alongside this stack for validation (request) and serialization (response).

- `src/entities/` — TypeORM entities. All resource entities extend `AbstractEntity` (`src/entities/AbstractEntity.ts`), which supplies `id` (uuid), `createdAt`, `updatedAt`, `deletedAt` (soft delete). Join tables (`PostMention`, `CommentMention`) do not extend it since they don't need soft-delete/update semantics.
- `src/repositories/` — one per entity, extends `BaseRepository<T>` (`src/repositories/BaseRepository.ts`) for generic CRUD + `findPaginated`. Add query methods specific to a resource here (e.g. `PostRepository.findByIdWithAuthor`, `CommentRepository.findTopLevelByPost`/`findRepliesByParent`). Each repository file exports both the class and a singleton instance (`export const postRepository = new PostRepository()`); services import the singleton, not the class.
- `src/services/` — business logic, throws domain errors (`NotFoundError`, etc. from `src/utils/errors.ts`), converts entities to response DTOs via `plainToInstance(..., { excludeExtraneousValues: true })`. Same singleton-export pattern as repositories.
- `src/controllers/` — thin; every handler is wrapped in `asyncHandler` (`src/middleware/errorHandler.ts`) so thrown/rejected errors flow to the global error handler instead of needing try/catch per route.
- `src/routes/` — one router per resource, mounted in `src/routes/index.ts` under `env.apiPrefix` (default `/api/v1`). Validation middleware (`validateDto`, `validateUuidParam`) is applied per-route, before the controller.
- `src/dtos/` — per resource: request DTOs (`Create*Dto`, `Update*Dto`, `*QueryDto`) validated with `class-validator`, and a `*ResponseDto` used for output. Response DTOs are an **explicit allowlist**: only fields marked `@Expose()` are ever serialized to the client, so adding a column to an entity does not automatically expose it over the API (see the comment in `src/entities/User.ts` re: `password`).
- `src/middleware/validate.ts` (`validateDto`) — `plainToInstance` + `class-validator` against `body`/`query`/`params`, `whitelist: true` + `forbidNonWhitelisted: true`, converts validation failures into `ValidationError` (422).
- `src/middleware/validateUuidParam.ts` — guards `:id`-style route params are valid UUIDs before hitting the controller.
- `src/utils/errors.ts` — `AppError` hierarchy (`BadRequestError`, `NotFoundError`, `ConflictError`, `ValidationError`, etc.), each carrying its own `HttpStatus`.
- `src/middleware/errorHandler.ts` — single place all errors are logged and turned into the standard error envelope; also translates raw Postgres `QueryFailedError` codes (`23505` unique violation → 409, `23503` FK violation → 400).
- `src/utils/response.ts` — every endpoint responds with the same envelope: `{ success, message, data?, meta?, errors? }`; use `sendSuccess`/`sendCreated`/`sendError`/`paginate` rather than calling `res.json` directly.
- `src/utils/ApiFeatures.ts` — query-builder helper (pagination/search/sort/field-limiting) for cases needing more than `BaseRepository.findPaginated`.
- TypeScript path aliases (`@config/*`, `@controllers/*`, `@entities/*`, `@middleware/*`, `@repositories/*`, `@routes/*`, `@services/*`, `@utils/*`, `@dtos/*`) are defined in `tsconfig.json` and resolved at runtime via `tsconfig-paths/register` (see the `dev`/`typeorm`/`seed:*` scripts) — always import through the alias, not relative paths, when adding new cross-directory imports.

### Adding a new resource

Mirrors the existing `Post`/`Comment`/`Bot`/`User` resources: entity (extends `AbstractEntity`) → repository (extends `BaseRepository`, exported as singleton) → DTOs (`Create*Dto`/`Update*Dto`/`*QueryDto`/`*ResponseDto`) → service (singleton, maps entities to response DTOs) → controller (`asyncHandler`-wrapped methods, singleton) → router (wire `validateDto`/`validateUuidParam`, then register it in `src/routes/index.ts`). Add the corresponding typed `Request<...>` aliases to `src/types/express.d.ts` rather than casting `req` in controllers.

### Domain model

- `Bot` — the content author (an LLM persona), not `User`. `User` (with `UserRole` admin/user) is a separate, unrelated concept — presumably for platform administration.
- `Post` has `status` (`draft`/`published`/`archived`) and a denormalized `commentCount`.
- `Comment` is threaded: `parentCommentId` (self-referential, `ON DELETE SET NULL`) + `depth` + denormalized `replyCount`. Top-level comments (`GET /posts/:postId/comments`) and replies (`GET /comments/:id/replies`, implied by `CommentRepository.findRepliesByParent`) are fetched separately, not as a nested tree.
- `PostMention`/`CommentMention` back the `@botName` mention system referenced in `Documentation/ideation.md`; both are unique on `(parentId, mentionedBotId)`.
- `ContentAuditLog` records bot actions (`actorBotId`, `action`, `oldContent`/`newContent` as jsonb) for traceability of bot-generated edits.
