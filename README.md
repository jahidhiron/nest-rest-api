# REST API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Portfolio is a TypeScript-based **NestJS** backend application built for modern web systems. It features SQLite (or PostgreSQL) integration with TypeORM, Redis for caching and token blacklisting, i18n support, Docker containerization, Mailgun-powered email communication with templated emails, Swagger API documentation, and CI/CD deployment.

---

## 📚 Table of Contents

- [Features](#-features)
- [Getting Started](#️-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Running Tests](#-running-tests)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-env-variables)
- [Email](#-email)
- [Help](#-help)
- [License](#license)

---

## 🚀 Features

- ⚙️ Built with **NestJS** and TypeScript
- 🐋 Docker containerization with `docker-compose`
- 🔐 JWT authentication with access & refresh tokens
- 🔒 Token blacklisting using Redis for enhanced security
- 🚪 Login device limitation to restrict simultaneous sessions
- 📦 SQLite (default) or PostgreSQL support via TypeORM
- 🔄 Redis caching and token blacklisting using `ioredis`
- 🌐 Internationalization (i18n) support via `nestjs-i18n` and `i18next`
- 📧 Email sending with **Mailgun** and Handlebars templating
- 🛡️ Security with Helmet for HTTP headers
- 📄 Auto-generated Swagger API documentation
- 📚 Organized modular architecture with feature-based modules
- 📜 Database migrations with TypeORM
- 🛠️ Logging with Winston & Nest-Winston integration
- 🧪 Unit and integration tests using Jest
- 🔁 CI/CD ready with GitHub Actions (customizable)

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:jahidhiron/nest-rest-api.git
cd nest-rest-api
npm install

```

### 1. Start project in locally

```bash
npm run start:dev

```

### 1. Start project in staging

```bash
npm run deploy:stage

```

### 1. Start project in production

```bash
npm run deploy:prod

```

## 📁 Project Structure

```

.
├── src/                                           # All application source code
│   ├── common/                                    # Cross‑cutting utilities
│   │   ├── decorator/                             # Custom NestJS / class decorators
│   │   ├── dtos/                                  # Re‑usable DTOs (validation / typing)
│   │   ├── entities/
│   │   │   └── base.entity.ts                     # Base entity → id, createdAt, updatedAt
│   │   ├── exceptions/                            # App‑wide HTTP / business exceptions
│   │   ├── filters/                               # Global exception filters
│   │   ├── guards/                                # Global auth / roles guards
│   │   ├── i18n/                                  # Global translation resources (fallback)
│   │   ├── interceptors/                          # Logging, response mapping, etc.
│   │   ├── logger/                                # Winston adapter & formatting helpers
│   │   ├── pipes/                                 # Validation / transformation pipes
│   │   ├── repositories/
│   │   │   └── base.repository.ts                 # Generic TypeORM repository
│   │   └── services/
│   │       ├── hash.service.ts                    # Bcrypt wrapper for hashing passwords
│   │       ├── response.service.ts                # Standard success/error response builder
│   │       └── success.service.ts                 # Centralised success message catalogue
│   │   └── validators/                            # Global custom class‑validator decorators
│   │
│   ├── config/                                    # Centralised, strongly‑typed configuration
│   │   ├── app/                                   # Application‑level settings (port, CORS, etc.)
│   │   ├── jwt/                                   # JWT secrets & expiry
│   │   ├── db/                                    # TypeORM configs (SQLite/Postgres)
│   │   ├── mail/                                  # Mailgun keys, templates path
│   │   ├── redis/                                 # Redis connection + Bull queue names
│   │   ├── swagger/                               # Swagger title, version, auth guard, etc.
│   │   ├── winston/                               # Logger formats & transports
│   │   ├── config.module.ts                       # Exposes ConfigModule.forRoot()
│   │   ├── config.service.ts                      # Typed config service (env validation)
│   │   └── i18n.config.ts                         # NestJS‑i18n setup (fs backend + resolver chain)
│   │
│   ├── helper/                                    # One‑off pure functions / small helpers
│   │
│   ├── migrations/                                # TypeORM CLI‑generated migration files
│   │
│   ├── module/                                    # Feature‑sliced domain modules
│   │   ├── auth/                                  # 🔐 Authentication / authorization domain
│   │   │   ├── dtos/                              # Auth‑specific DTOs
│   │   │   ├── entities/
│   │   │   │   ├── login-history.entity.ts        # IP / user‑agent audit trail
│   │   │   │   ├── verification-token.entity.ts   # Email / reset tokens
│   │   │   │   └── index.ts                       # Entity barrel export
│   │   │   ├── https/                             # External HTTP requests (e.g., social login)
│   │   │   ├── i18n/                              # Auth‑localised messages auto‑loaded by i18n
│   │   │   ├── interfaces/                        # Types / contracts used only by auth
│   │   │   ├── providers/                         # Business‑logic “services” (For testabilit)
│   │   │   │   ├── signup.provider.ts
│   │   │   │   ├── signin.provider.ts
│   │   │   │   └── …                              # (refresh, forgot‑password, etc.)
│   │   │   ├── repositories/
│   │   │   │   ├── auth.repository.ts             # Extends BaseRepository with auth queries
│   │   │   │   └── index.ts                       # Barrel export
│   │   │   ├── swaggers/                          # `@nestjs/swagger` decorators per route
│   │   │   ├── templates/
│   │   │   │   └── signup.hbs                     # Handlebars email template example
│   │   │   ├── auth.controller.ts                 # Route handlers
│   │   │   └── auth.module.ts                     # Combines providers + controller + imports
│   │   │
│   │   ├── user/                                  # 👤 User CRUD (structure mirrors auth)
│   │   ├── author/                                # 🖋  Author entity / routes
│   │   │   ├── ...
│   │   │   ├── providers/                         # ✅ Unit tests for author providers
│   │   │   │   ├── test/
│   │   │   │   │   ├── author.facade.spec.ts
│   │   │   │   │   ├── create-author.provider.spec.ts
│   │   │   │   │   ├── author-detail.provider.spec.ts
│   │   │   │   │   ├── ...
│   │   │   │   │   author.facade.ts
│   │   │   │   │   create-author.provider.ts
│   │   │   │   │   author-detail.provider.ts
│   │   │   │   │   ...
│   │   │   ├── repositories/
│   │   │   │   ├── test/
│   │   │   │   │   ├── author.repository.spec.ts
│   │   │   │   │   author.repository.ts
│   │   │   ├── ...
│   │   │   ├── author.controller.spec.ts
│   │   │   ├── author.controller.ts
│   │   │   ├── author.module.ts
│   │   └── book/                                  # 📚 Book entity / routes
│   │
│   ├── shared/                                    # Singleton services used by many modules
│   │   ├── constants/                             # String literals, regexes, etc.
│   │   ├── enums/                                 # App‑wide enums
│   │   ├── interfaces/                            # Shared TS interfaces
│   │   ├── jwt/                                   # JWT sign/verify helpers
│   │   ├── mail/                                  # Mailgun wrapper
│   │   ├── redis/                                 # Redis client / Bull queue helpers
│   │   ├── services/                              # Misc shared providers
│   │   ├── types/                                 # Utility TS types
│   │   └── shared.module.ts                       # Re‑export shared providers for feature modules
│   │
│   ├── utils/                                     # Generic, framework‑agnostic helpers
│   │
│   ├── app.controller.ts                          # Health‑check & root endpoints
│   ├── app.module.ts                              # Root NestJS module
│   ├── app.service.ts                             # Lightweight example service
│   ├── db.service.ts                              # Programmatic DB connection (for scripts/tests)
│   ├── main.ts                                    # NestFactory bootstrap
│   ├── swagger.ts                                 # Swagger builder (includes basic‑auth guard)
│   └── test/                                      # Jest e2e / unit test entrypoints
│
├── .dockerignore                                  # Files to exclude from Docker builds
├── .env.development                               # Local dev env vars
├── .env.staging                                   # Staging env vars
├── .env.production                                # Production env vars
├── .gitignore                                     # Standard Git ignore list
├── docker-compose.yaml                            # App + Redis container orchestration
├── Dockerfile                                     # Multi‑stage image build (builder + runtime)
├── entrypoint.sh                                  # Container CMD → run migrations, start Nest
├── export.sh                                      # DB export helper script
├── jest.config.ts                                 # ⚙️ Jest config for unit tests
├── eslint.config.mjs                              # ESLint monorepo‑style config
├── nest-cli.json                                  # NestJS CLI ts‑paths / assets config
├── postman-collection.json                        # Postman collection for API consumers
├── README.md                                      # 📖 You’re reading the updated version
├── tsconfig.build.json                            # TS config for production build
└── tsconfig.json                                  # TS config for IDE / ts-node


```

## 🧪 Running Tests

### Unit Tests

Run all unit tests using Jest:

```bash
npm run test

```

This codebase uses **Jest** and **ts-jest** for automated testing.  
Currently, **the `Author` module is fully covered with unit tests**, targeting providers, the facade, and controller logic. Other modules can follow the same structure for coverage.

---

### ✅ What is tested?

Each unit test isolates a specific component by **mocking all external dependencies**, ensuring fast and reliable test runs.

| Spec File                          | What it tests                          | Mocked Dependencies                    |
| ---------------------------------- | -------------------------------------- | -------------------------------------- |
| `create-author.provider.spec.ts`   | Author creation logic                  | `AuthorRepository`, `HashService`      |
| `find-authors.provider.spec.ts`    | Finding a paginated list of authors    | `AuthorRepository`                     |
| `find-one-author.provider.spec.ts` | Finding a single author by ID          | `AuthorRepository`                     |
| `update-author.provider.spec.ts`   | Updating an author's details           | `AuthorRepository`                     |
| `remove-author.provider.spec.ts`   | Soft-deleting an author                | `AuthorRepository`                     |
| `author-detail.provider.spec.ts`   | Formatting a detailed author response  | — (mostly pure logic or mocked entity) |
| `author.facade.spec.ts`            | Orchestrating create, update, delete   | All above provider classes             |
| `author.controller.spec.ts`        | Routing, DTO validation, HTTP behavior | AuthorFacade, plus mock guards         |

> 📁 Test files are organized inside `src/module/author/providers/test/` and next to the controller.  
> This domain-scoped layout ensures clarity and test relevance.

---

### ▶️ Run the tests

Use these scripts defined in your `package.json`:

| Description              | Command              |
| ------------------------ | -------------------- |
| Run all unit tests       | `npm run test`       |
| Run tests in watch mode  | `npm run test:watch` |
| Generate coverage report | `npm run test:cov`   |
| Run tests in debug mode  | `npm run test:debug` |

> ✅ Coverage output is generated in `coverage/lcov-report/index.html`

---

### ⚙️ Jest Configuration

Jest is configured in `jest.config.ts` and includes:

- ✅ TypeScript support via `ts-jest`
- ✅ Test discovery for `*.spec.ts` inside `src/`
- ✅ Path alias support (e.g., `@/common/...`)
- ✅ Coverage collection for all `.ts` and `.js` files
- ✅ Node test environment

---

### 🧪 Mocking & Testing Guidelines

This project uses **Jest + ts-jest** for unit and integration tests, focusing on isolated testing of **providers** (business logic/services) and **controllers** (HTTP layer). Below is an overall guideline to help you write clean, maintainable, and reliable tests for both layers.

---

## 1. Testing Providers (Business Logic / Services)

Providers are classes that contain your core business logic, such as creating, updating, or querying data. Unit tests here should focus on the internal logic of each provider in isolation.

### Key points:

- **Isolate the provider under test** by mocking all its dependencies (repositories, other services, external APIs).
- Use Jest mocks (`jest.fn()`) to stub dependency methods with controlled return values.
- Test **happy paths**, **edge cases**, and **error handling**.
- Keep tests **fast and deterministic** — avoid actual database or network calls.

### Typical mocks in providers:

| Dependency          | What to mock                                                               |
| ------------------- | -------------------------------------------------------------------------- |
| Repositories        | `.create()`, `.save()`, `.findOne()`, `.update()`, `.softDelete()` methods |
| Other Providers     | Any business methods your provider calls                                   |
| Hashing / Utilities | Hashing functions, encryption, formatting                                  |

### Example:

```ts
const authorRepository = {
  create: jest.fn().mockResolvedValue(createdAuthor),
  save: jest.fn().mockResolvedValue(savedAuthor),
};

const provider = new CreateAuthorProvider(authorRepository as any);

it('should create an author', async () => {
  const result = await provider.execute(authorInput, user);
  expect(authorRepository.create).toHaveBeenCalledWith(
    expect.objectContaining({ firstName: 'Jane' }),
  );
  expect(result).toEqual(createdAuthor);
});
```

## 2. Testing Repositories (Data Access Layer)

Repositories interact with the database and contain data-access logic, typically implemented using TypeORM or any ORM.

### Key points:

- Mock the `DataSource` and repository methods (`.create()`, `.save()`, `.findOne()`, `.merge()`, `.delete()`) to avoid actual DB calls.
- Mock the query builder (`createQueryBuilder`) and its methods (`getOne()`, `getManyAndCount()`) when using complex queries.
- Test typical CRUD operations and handle cases like not found or invalid input.
- Ensure tests don't rely on a real database connection — keep them fast and deterministic.

### Typical methods to mock:

| Method               | Description                                           |
| -------------------- | ----------------------------------------------------- |
| `.create()`          | Creates a new entity instance                         |
| `.save()`            | Persists entity in the database                       |
| `.findOne()`         | Finds one entity by criteria                          |
| `.merge()`           | Merges partial data into existing entity              |
| `.delete()`          | Removes entity from database                          |
| `.getOne()`          | Query builder method to fetch one result              |
| `.getManyAndCount()` | Query builder method to fetch many results with count |

### Example:

```ts
const repoMock = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
};

const dataSourceStub = {
  getRepository: jest.fn().mockReturnValue(repoMock),
} as unknown as DataSource;

jest.mock('@/helpers', () => ({
  createQueryBuilder: jest.fn(),
}));
import { createQueryBuilder as mockedCreateQB } from '@/helpers';

describe('AuthorRepository', () => {
  let authorRepo: AuthorRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    (mockedCreateQB as jest.Mock).mockImplementation(() => ({
      getOne: jest.fn(),
      getManyAndCount: jest.fn(),
    }));
    authorRepo = new AuthorRepository(dataSourceStub);
  });

  it('creates an author', async () => {
    const author = { firstName: 'Jane' } as AuthorEntity;
    repoMock.create.mockReturnValue(author);
    repoMock.save.mockResolvedValue(author);

    const result = await authorRepo.create(author);

    expect(repoMock.create).toHaveBeenCalledWith(author);
    expect(repoMock.save).toHaveBeenCalledWith(author);
    expect(result).toEqual(author);
  });

  // Additional tests for update, delete, findOne, findAll, error cases ...
});
```

## Testing Controllers

| Focus                 | Approach                                     |
| --------------------- | -------------------------------------------- |
| Dependencies          | Mock providers and services with `jest.fn()` |
| Guards / Interceptors | Override with no-op implementations          |
| Controller methods    | Verify calls to providers with correct args  |
| Responses             | Assert correct data or error handling        |
| Setup                 | Use `Test.createTestingModule` with mocks    |

### Example

```ts
const module = await Test.createTestingModule({
  controllers: [AuthorController],
  providers: [
    {
      provide: AuthorFacade,
      useValue: {
        findMany: { execute: jest.fn() },
        userDetail: { execute: jest.fn() },
      },
    },
    { provide: SuccessService, useValue: { ok: jest.fn() } },
  ],
}).compile();

const controller = module.get(AuthorController);

await controller.findMany({ page: 1, size: 10 });
expect(authorFacade.findMany.execute).toHaveBeenCalledWith({
  page: 1,
  size: 10,
});
```

### 📁 Adding More Tests

To expand testing into other modules (like `user`, `auth`, `book`), follow this structure:

### e2e Tests

Run all unit tests using Jest:

```bash
npm run test:e2e

```

## 📄 API Documentation

After starting the server, you can access the interactive Swagger UI documentation at:

- 🔗 **Local:** [http://localhost:5002/api-docs](http://localhost:5002/api-docs)
- 🔗 **Live:** [https://api.test.developertroop.com/api-docs](https://api.test.developertroop.com/api-docs)

> ⚠️ The Swagger UI is protected with Basic Auth.
>
> Use the following credentials defined in your `.env` file:
>
> - **Username:** `SWAGGER_USER`
> - **Password:** `SWAGGER_PASSWORD`

## ⚙️ Environment Variables

The application uses environment variables for configuration. Below is a reference of required keys:

```env
# App
PORT=
DB_HOST=
CORS_ORIGIN=
ENV_FILE_NAME=
COMPANY_NAME=
API_BASE_URL=
SUPPORT_EMAIL=

# Database
DB_TYPE=
DB_PATH=

# JWT
JWT_SECRET_ACCESS_TOKEN=
JWT_SECRET_REFRESH_TOKEN=
JWT_ACCESS_TOKEN_EXPIRED_IN=
JWT_REFRESH_TOKEN_EXPIRED_IN=
JWT_ISSUER=
JWT_AUDIENCE=

# Swagger (Basic Auth)
SWAGGER_USER=
SWAGGER_PASSWORD=
SWAGGER_DEVELOPMENT_BASE_URL=
SWAGGER_LIVE_BASE_URL=

# Mailgun
MAILGUN_DOMAIN=
MAILGUN_API_KEY=
MAILGUN_SENDER_EMAIL=

# Redis
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

# Docker
API_CONTAINER_NAME=
```

## 📧 Email

This project integrates **Mailgun** for transactional email delivery, using **Handlebars** (`.hbs`) as the templating engine.

### ✨ Features

- Dynamic, precompiled email templates (e.g., signup, email verification, verify user, password reset, change password)
- Template-based system using `handlebars`
- Modular structure per feature (e.g., auth)
- Fully configurable via environment variables

### 📂 Template Structure

Templates are organized per module inside:

```text
src/module/<module-name>/templates/<file-name>.hbs
```

## 🆘 Help

If you need help or want to contact the maintainer, please reach out at:

**Email:** [namehiron.96@gmail.com]

## 📄 License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for details.
