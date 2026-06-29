# AGENTS.md

Instructions for AI agents working with the **Code Connect** codebase.

---

## Project Overview

**Code Connect** is a social/collaboration platform for developers built as a **pnpm monorepo** with two applications:

| App | Path | Stack | Port |
|-----|------|-------|------|
| **API** | `apps/api` | NestJS 11, TypeScript, Prisma, PostgreSQL | `3000` |
| **Web** | `apps/web` | React 19, Vite 8, TypeScript | `5173` |

### Architecture

```
code-connect/
├── apps/
│   ├── api/          # NestJS backend — REST API with JWT auth
│   │   ├── prisma/   # Database schema and migrations
│   │   ├── src/
│   │   │   ├── auth/     # Authentication (register, login, JWT)
│   │   │   ├── users/    # User profiles CRUD
│   │   │   ├── posts/    # Posts/feed CRUD
│   │   │   └── prisma/   # Prisma client module (global)
│   │   └── test/     # E2E tests
│   └── web/          # React frontend — Vite SPA, Tailwind CSS
│       └── src/
│           ├── components/ # Atomic Design structure
│           │   ├── atoms/
│           │   ├── molecules/
│           │   ├── organisms/
│           │   └── templates/
│           └── pages/
├── package.json          # Root workspace scripts
└── pnpm-workspace.yaml   # Workspace config
```

### Key Patterns

- **Modules follow NestJS convention**: each feature is a self-contained module with `*.module.ts`, `*.controller.ts`, `*.service.ts`.
- **Prisma is a global module**: `PrismaService` is available everywhere without explicit imports in each module.
- **DTOs use `class-validator`**: all request bodies must be validated via DTO classes with decorators.
- **Auth is JWT-based**: `@nestjs/passport` with `passport-jwt` strategy. Protected routes use `JwtAuthGuard`.

---

## Build and Test Commands

All commands are run from the **workspace root** (`code-connect/`).

### Development

```bash
# Start the API in watch mode
pnpm api:dev

# Start the web frontend dev server
pnpm web:dev
```

### Build

```bash
# Build the API for production
pnpm api:build

# Build the web frontend
pnpm web:build
```

### Testing

```bash
# Run API unit tests
pnpm --filter api run test

# Run API unit tests in watch mode
pnpm --filter api run test:watch

# Run API tests with coverage
pnpm --filter api run test:cov

# Run API E2E tests
pnpm --filter api run test:e2e
```

### Linting & Formatting

```bash
# Lint the API
pnpm --filter api run lint

# Lint the web app
pnpm --filter web run lint

# Format API code with Prettier
pnpm --filter api run format
```

### Database (Prisma)

```bash
# Generate Prisma client after schema changes
pnpm --filter api exec prisma generate

# Create and apply a migration
pnpm --filter api exec prisma migrate dev --name <migration_name>

# Reset the database (destructive)
pnpm --filter api exec prisma migrate reset

# Open Prisma Studio (visual DB browser)
pnpm --filter api exec prisma studio
```

### Installing Dependencies

```bash
# Add a dependency to the API
pnpm --filter api add <package>

# Add a dev dependency to the web app
pnpm --filter web add -D <package>
```

---

## Code Style Guidelines

### TypeScript

- **Strict null checks** are enabled (`strictNullChecks: true`).
- **`noImplicitAny` is off** — explicit `any` is allowed but discouraged. Prefer proper typing.
- **Target**: ES2023.
- **Module system**: API uses `nodenext`; Web uses ESM (`"type": "module"`).

### Formatting (Prettier)

Enforced via ESLint integration. Configuration:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "endOfLine": "auto"
}
```

### ESLint Rules

**API** (`apps/api`):
- Extends: `eslint:recommended`, `typescript-eslint/recommendedTypeChecked`, `prettier`.
- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-floating-promises`: warn
- `@typescript-eslint/no-unsafe-argument`: warn

**Web** (`apps/web`):
- Extends: `eslint:recommended`, `typescript-eslint/recommended`, `react-hooks`, `react-refresh`.
- Globals: `browser`.

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files (NestJS) | `kebab-case` with suffix | `auth.controller.ts`, `jwt-auth.guard.ts` |
| Files (React) | `PascalCase` | `HomePage.tsx`, `Header.tsx` |
| Classes | `PascalCase` | `AuthService`, `UsersController` |
| Interfaces/Types | `PascalCase` | `CreatePostDto` |
| Variables/Functions | `camelCase` | `getHello()`, `isPasswordValid` |
| Database models | `PascalCase` (singular) | `User`, `Post` |
| API endpoints | `kebab-case` (plural) | `/api/users`, `/api/posts` |

### NestJS & REST Conventions

- One module per feature directory.
- Use constructor injection (`private readonly`).
- DTOs go in a `dto/` subdirectory inside the feature module.
- Guards, strategies, and interceptors live in the module they belong to.
- Use `@Global()` sparingly — only for cross-cutting modules like `PrismaModule`.
- **REST Principles**:
  - Use standard HTTP methods correctly (`GET` for retrieval, `POST` for creation, `PUT`/`PATCH` for updates, `DELETE` for removal).
  - Use appropriate HTTP status codes (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
  - Keep URLs resource-oriented and stateless. Avoid verbs in URLs (use `POST /users`, not `POST /create-user`).

### Frontend Architecture (React)

- **Atomic Design**: The `src/components` directory follows the Atomic Design methodology:
  - `atoms/`: Basic UI components (buttons, inputs, labels).
  - `molecules/`: Groups of atoms working together (search form, user card).
  - `organisms/`: Complex UI components formed by molecules/atoms (header, post feed).
  - `templates/`: Page-level layouts without specific content.
- **Styling**: **Tailwind CSS** (v4) is the primary styling solution.
  - Avoid using raw CSS files for component styling; use Tailwind utility classes directly in the `className` props.
  - **Design Tokens**: Do NOT use arbitrary values in brackets (e.g., `w-[340px]`, `text-[15px]`, `stroke-[#4ADE80]`). ALWAYS use the closest standard Tailwind tokens (e.g., `w-84`, `text-sm`, `stroke-current text-green-primary`).
  - **Color Palette**: The project's color palette is defined in `apps/web/src/index.css` using the Tailwind v4 `@theme` directive. Use these semantic variables (e.g., `bg-bg-dark`, `text-green-primary`) instead of raw hex codes.

### Git Conventions

- **Conventional Commits**: All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
  - Format: `<type>[optional scope]: <description>`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
  - Example: `feat(api): add user registration endpoint`
  - Example: `fix(web): correct button alignment on mobile`

---

## Testing Instructions

### Unit Tests (API)

- **Framework**: Jest + ts-jest
- **Location**: Co-located with source files as `*.spec.ts` (e.g., `auth.service.spec.ts` next to `auth.service.ts`).
- **Test environment**: Node.
- **Pattern**: `.*\.spec\.ts$`

When writing tests:

```typescript
// Use NestJS testing utilities
import { Test, TestingModule } from '@nestjs/testing';

// Mock PrismaService — never hit a real database in unit tests
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

// Build a testing module
const module: TestingModule = await Test.createTestingModule({
  providers: [
    AuthService,
    { provide: PrismaService, useValue: mockPrismaService },
  ],
}).compile();
```

### E2E Tests (API)

- **Location**: `apps/api/test/*.e2e-spec.ts`
- **Config**: `apps/api/test/jest-e2e.json`
- **Pattern**: `.e2e-spec.ts$`
- Use `supertest` for HTTP assertions.

### Frontend Tests

- Not yet configured. When adding, use **Vitest** (already bundled with Vite) and **React Testing Library**.

### Test Principles

1. **Mock external dependencies** (database, third-party APIs) — unit tests must be fast and isolated.
2. **Test behavior, not implementation** — assert on outputs and side effects, not internal method calls.
3. **Each test must be independent** — no shared mutable state between tests.
4. **Descriptive test names** — use `describe` blocks for grouping and `it('should ...')` for cases.

---

## Security Considerations

### Authentication & Authorization

- **Passwords** are hashed with `bcrypt` (10 salt rounds) — never store or log plaintext passwords.
- **JWT tokens** are signed with `JWT_SECRET` from environment variables — never hardcode secrets.
- **Protected routes** must use `@UseGuards(JwtAuthGuard)` — always verify before adding a new public endpoint.
- **Login errors** must use generic messages (`"Invalid credentials"`) — never reveal whether the email or password was wrong.

### Environment Variables

- **`.env` files must never be committed to git.** Verify `.gitignore` includes `.env`.
- Required variables:
  - `DATABASE_URL` — PostgreSQL connection string
  - `JWT_SECRET` — must be a strong, random string in production

### Input Validation

- **All request bodies must use DTOs** with `class-validator` decorators.
- **`ValidationPipe` is enabled globally** — malformed requests are rejected automatically.
- **Never trust client input** — always validate and sanitize.

### Database

- **Use Prisma's parameterized queries** — they prevent SQL injection by default. Never use raw SQL with string interpolation.
- **Exclude sensitive fields** from API responses — never return `password` in user objects. Use Prisma's `select` or `omit` to filter fields.

### CORS

- CORS is configured to allow only the frontend origin (`http://localhost:5173` in development).
- **In production**, restrict the origin to the actual deployed frontend domain.

### General Rules

- Never log sensitive data (passwords, tokens, personal info).
- Keep dependencies updated — run `pnpm audit` periodically.
- Use `@nestjs/config` for all environment-dependent values — never use `process.env` directly in services.
