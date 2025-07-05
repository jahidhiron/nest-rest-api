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
- [License](#-license)

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

### 2. Start project in staging

```bash
npm run deploy:stage

```

### 3. Start project in production

```bash
npm run deploy:prod

```

## 📁 Project Structure

```

.
├── src/                                           # All application source code
│   ├── common/                                    # Cross‑cutting utilities
│   │   ├── decorator/
│   │   ├── dtos/                                  # Re‑usable DTOs
│   │   ├── entities/
│   │   │   └── base.entity.ts                     # Base entity → id, createdAt, updatedAt, isDelete
│   │   ├── exceptions/                            # App‑wide HTTP / business exceptions
│   │   ├── filters/                               # Global filters
│   │   ├── guards/                                # Global auth guards
│   │   ├── i18n/
│   │   ├── interceptors/                          # Logging, data serialize, etc.
│   │   ├── logger/                                # Winston adapter & formatting helpers
│   │   ├── pipes/                                 # Validation, deserialize query
│   │   ├── repositories/
│   │   │   └── base.repository.ts                 # Generic TypeORM repository
│   │   └── services/
│   │       ├── hash.service.ts                    # scrypt wrapper for hashing passwords
│   │       ├── response.service.ts                # Standard success,error response builder
│   │       └── success.service.ts                 # Centralised success message catalogue
│   │   └── validators/                            # Global custom class‑validator decorators
│   │
│   ├── config/                                    # Centralised, strongly‑typed configuration
│   │   ├── app/                                   # Application‑level settings (port, CORS, etc.)
│   │   ├── jwt/                                   # JWT secrets & expiry
│   │   ├── db/                                    # TypeORM configs (SQLite/Postgres)
│   │   ├── mail/                                  # Mailgun keys
│   │   ├── redis/                                 # Redis key
│   │   ├── swagger/                               # Swagger title, version, auth guard, etc.
│   │   ├── winston/                               # Logger formats & transports
│   │   ├── config.module.ts                       # Exposes ConfigModule.forRoot()
│   │   ├── config.service.ts                      # Centralised config service
│   │   └── i18n.config.ts                         # NestJS‑i18n setup
│   │
│   ├── helper/                                    # One‑off pure functions / small helpers
│   │
│   ├── migrations/                                # TypeORM CLI‑generated migration files
│   │
│   ├── module/                                    # Feature‑sliced domain modules
│   │   ├── auth/                                  # 🔐 Authentication / authorization domain
│   │   │   ├── dtos/                              # Auth‑specific DTOs
│   │   │   ├── entities/
│   │   │   │   ├── login-history.entity.ts        # IP, user‑agent audit trail
│   │   │   │   ├── verification-token.entity.ts   # Email, reset tokens
│   │   │   │   └── index.ts
│   │   │   ├── https/                             # API endpoints
│   │   │   ├── i18n/                              # Module-wise i18n message
│   │   │   ├── interfaces/
│   │   │   ├── providers/                         # Business‑logic “services” (For testability)
│   │   │   │   ├── signup.provider.ts
│   │   │   │   ├── signin.provider.ts
│   │   │   │   └── …
│   │   │   ├── repositories/
│   │   │   │   ├── auth.repository.ts             # Extends BaseRepository with auth queries
│   │   │   │   └── index.ts
│   │   │   ├── swaggers/                          # auth module swagger setup
│   │   │   ├── templates/
│   │   │   │   ├── emails/
│   │   │   │   │   └── signup.hbs                 # Handlebars email template example
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── user/                                  # 👤 User module
│   │   ├── author/                                # 🖋  Author module
│   │   │   ├── ...
│   │   │   ├── providers/
│   │   │   │   ├── test/                          # ✅ Unit tests for author providers
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
│   │   └── book/                                  # 📚 Book module
│   │
│   ├── shared/                                    # Singleton services used by many modules
│   │   ├── constants/
│   │   ├── enums/
│   │   ├── interfaces/
│   │   ├── jwt/                                   # JWT sign,verify service
│   │   ├── mail/                                  # Mailgun service
│   │   ├── redis/                                 # Redis service
│   │   ├── services/                              # Shared services
│   │   ├── types/
│   │   └── shared.module.ts
│   │
│   ├── utils/                                     # Generic, framework‑agnostic helpers
│   │
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── db.source.ts                               # Centralized TypeORM `DataSource` definition
│   ├── main.ts
│   ├── swagger.ts                                 # Swagger builder
│   └── test/                                      # Jest e2e test
│   │   └── interfaces/
│   │   └── auth.e2e-helper.ts                     # Helper functions for authentication-related tests (e.g., signup, signin)
│   │   └── author.e2e-spec.ts                     # E2E test specs for Author module (CRUD, auth, permissions)
│   │   └── setup.ts                               # Global test setup (e.g., jest configuration, environment setup)
│   │   └── test-app.setup.ts                      # Utility to create and configure the NestJS test application instance
│
├── .dockerignore
├── .env.development                               # Local dev env vars
├── .env.staging                                   # Staging env vars
├── .env.production                                # Production env vars
├── .env.test                                      # Test env vars
├── .gitignore
├── docker-compose.yaml                            # Container orchestration
├── Dockerfile                                     # Multi‑stage image build
├── entrypoint.sh                                  # Container CMD → run migrations, start Nest
├── export.sh                                      # DB export helper script
├── jest-e2e.json                                  # ⚙️ Jest config for e2e tests
├── jest.config.ts                                 # ⚙️ Jest config for unit tests
├── eslint.config.mjs
├── nest-cli.json
├── postman-collection.json                        # Postman collection for API consumers
├── README.md
├── tsconfig.build.json
└── tsconfig.json


```

## 🧪 Running Tests

### Unit Tests

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

This codebase uses **Jest** and **ts-jest** for automated testing.  
Currently, **the `Author` module is fully covered with unit tests**, targeting providers, the facade, and controller logic. Other modules can follow the same structure for coverage.

---

### 🧪 Mocking & Testing Guidelines

This project uses **Jest + ts-jest** for unit and integration tests, focusing on isolated testing of **providers** (business logic/services) and **controllers** (HTTP layer). Below is an overall guideline to help you write clean, maintainable, and reliable tests for both layers.

---

## 1. Testing Controllers

This module contains comprehensive unit tests for the `AuthorController` in the Netzet Book Store API.

### ✅ What is tested?

This unit test targets the **controller layer logic**, ensuring it behaves correctly in isolation by mocking all external dependencies such as facades, services, and guards. It verifies that each controller method returns the expected response without relying on actual database access or service implementations.

| Spec File                   | What it tests         | Mocked Dependencies          |
| --------------------------- | --------------------- | ---------------------------- |
| `author.controller.spec.ts` | Author creation logic | `DataSource`, `AuthorEntity` |

> 📁 Test files are organized inside `src/module/author/`
> This domain-scoped layout ensures clarity and test relevance.

---

### Key points:

- All external dependencies are mocked (`AuthorFacade`, `SuccessService`, `Guards`) to isolate controller logic.
- Covers core methods: `findMany`, `detail`, `update`, and `remove`.
- Simulates realistic scenarios: successful fetch, update, delete, and empty results.
- Avoids real database or service calls to ensure fast and deterministic test runs.
- Guards like `AuthGuard`, `AuthorGuard`, and `AdminGuard` are stubbed to always allow access.

### Typical methods to mock:

| Method                       | Description                                            |
| ---------------------------- | ------------------------------------------------------ |
| `findMany.execute()`         | Fetches a paginated list of authors                    |
| `userDetail.execute()`       | Retrieves a single author's detail                     |
| `update.execute()`           | Updates an existing author's information               |
| `remove.execute()`           | Deletes (soft/hard) an author                          |
| `SuccessService.ok()`        | Returns a standard 200 success response                |
| `SuccessService.noContent()` | Returns a standard 204 no-content response for deletes |

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

## 2. Testing Providers (Business Logic / Services)

Providers are classes that contain your core business logic, such as creating, updating, or querying data. Unit tests here should focus on the internal logic of each provider in isolation.

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

> 📁 Test files are organized inside `src/module/author/providers/test/`  
> This domain-scoped layout ensures clarity and test relevance.

---

### Key points:

- **Isolate the provider under test** by mocking all its dependencies (repositories, other services, external APIs).
- Use Jest mocks (`jest.fn()`) to stub dependency methods with controlled return values.
- Test **happy paths**, **edge cases**, and **error handling**.
- Keep tests **fast and deterministic** — avoid actual database or network calls.

### Typical mocks in providers:

| Dependency          | What to mock                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| Repositories        | `.create()`, `.save()`, `.findOne()`, `.findMany()`, `.update()`, methods |
| Other Providers     | Any business methods your provider calls                                  |
| Hashing / Utilities | Hashing functions, encryption, formatting                                 |

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

---

## 3. Testing Repositories (Data Access Layer)

Repositories interact with the database and contain data-access logic, typically implemented using TypeORM or any ORM.

### ✅ What is tested?

This unit test targets the **repository layer logic**, ensuring it behaves correctly in isolation by mocking all external services and dependencies such as hashing utilities or database operations.

| Spec File                   | What it tests         | Mocked Dependencies          |
| --------------------------- | --------------------- | ---------------------------- |
| `author.repository.spec.ts` | Author creation logic | `DataSource`, `AuthorEntity` |

> 📁 Test files are organized inside `src/module/author/repositories/test/`
> This domain-scoped layout ensures clarity and test relevance.

---

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
| `.update()`          | Update data in the existing entity                    |
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

  // Additional tests for update, delete, findOne, findMany, etc error cases ...
});
```

---

### Test Summary

```
PASS src/modules/author/providers/test/author-detail.provider.spec.ts
PASS src/modules/author/author.controller.spec.ts
PASS src/modules/author/providers/test/update-author.provider.spec.ts
PASS src/modules/author/providers/test/remove-author.provider.spec.ts
PASS src/modules/author/providers/test/author.facade.spec.ts
PASS src/modules/author/providers/test/create-author.provider.spec.ts
PASS src/modules/author/providers/test/find-one-author.provider.spec.ts
PASS src/modules/author/providers/test/find-authors.provider.spec.ts
PASS src/modules/author/repositories/test/author.repository.spec.ts

Test Suites: 9 passed, 9 total
Tests: 47 passed, 47 total
Snapshots: 0 total
Ran all test suites
```

---

### 📁 Adding More Tests

To expand testing into other modules (like `user`, `auth`, `book`), follow this structure:

---

### E2E Tests

### ▶️ Run the tests

Use these scripts defined in your `package.json`:

| Description       | Command            |
| ----------------- | ------------------ |
| Run all e2e tests | `npm run test:e2e` |

# Author Module - E2E Testing

This document summarizes the end-to-end (E2E) tests for the **Author Module**. The tests cover authentication, CRUD operations, authorization, and error handling.

---

## Test Setup

- Uses **NestJS** testing utilities and **Supertest** for HTTP request testing.
- Auth tokens are generated for different user roles: author and admin.
- Tests cover valid and invalid authentication scenarios.
- Database is reset after all tests.
- When a user signs up with the role `author`, **an associated author profile is automatically created behind the scenes**.

---

## Test Summary

### Authentication

- Author and admin users successfully authenticate and receive access tokens.
- Requests without token or with invalid token are rejected with `401 Unauthorized`.

### Author Update (`PATCH /api/v1/authors/:id`)

- Author can update own profile (`200 OK`).
- Missing or invalid token results in `401 Unauthorized`.
- Author cannot update other authors (`401 Permission denied`).
- Admin can update any author (`200 OK`).
- Updating a non-existent author results in `404 Not Found`.

### Author Detail (`GET /api/v1/authors/:id`)

- Author can view own details (`200 OK`).
- Author cannot view other authors' details (`401 Permission denied`).
- Admin can view any author details (`200 OK`).
- Requests without token or with invalid token rejected (`401 Unauthorized`).
- Requests for non-existent author return `404 Not Found`.

### Author List (`GET /api/v1/authors`)

- Admin can get paginated, sorted, and filtered list of authors (`200 OK`).
- Requests without token, with invalid token, or with insufficient role rejected (`401 Unauthorized`).

### Author Deletion (`DELETE /api/v1/authors/:id`)

- Admin can delete any author (`204 No Content`).
- Missing or invalid token results in `401 Unauthorized`.
- Author cannot delete other authors (`401 Permission denied`).
- Deleting a non-existent author returns `404 Not Found`.

---

## Sample Test Output

```
Author Module (e2e)
    √ /auth/signin (POST) - author should authenticate successfully (3 ms)
    √ /auth/signin (POST) - admin should authenticate successfully (1 ms)
    √ /auth/signin (POST) - author should authenticate successfully (1 ms)
    √ /auth/signin (POST) - admin should authenticate successfully (1 ms)
    √ PATCH /api/v1/authors/:id – author updates own profile (200) (60 ms)
    √ PATCH /api/v1/authors/:id  missing token (401) (22 ms)
    √ PATCH /api/v1/authors/:id – invalid token (401) (16 ms)
    √ PATCH /api/v1/authors/:id – author updates another author (401) (25 ms)
    √ PATCH /api/v1/authors/:id – admin updates author (200) (47 ms)
    √ PATCH /api/v1/authors/:id – author not found (404) (22 ms)
  GET /api/v1/authors - list authors
    √ GET /api/v1/authors/:id - should return author detail (200) (19 ms)
    √ GET /api/v1/authors/:id - should fail without token (401) (16 ms)
    √ GET /api/v1/authors/:id - should fail with invalid token (401) (15 ms)
    √ GET /api/v1/authors/:id - should fail if author accesses another author (401) (20 ms)
    √ GET /api/v1/authors/:id - should fail if author not found (404) (20 ms)
    √ GET /api/v1/authors/:id - admin should access any author detail (19 ms)
    √ should return paginated author list (200) (24 ms)
    √ should respect page & size query params (20 ms)
    √ should sort authors (id desc) (21 ms)
    √ should filter by free‑text search query (19 ms)
    √ should fail without token (401) (16 ms)
    √ should fail with invalid token (401) (15 ms)
    √ should return 401 if role is insufficient (17 ms)
  DELETE /api/v1/authors/:id (delete author)
    √ admin deletes any author (204) (25 ms)
    √ fails without token (401) (15 ms)
    √ fails with invalid token (401) (14 ms)
    √ fails when author tries to delete another author (401) (18 ms)
    √ fails when author not found (404) (19 ms)

Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        12.093 s, estimated 14 s
```

## 📄 API Documentation

After starting the server, you can access the interactive Swagger UI documentation at:

- 🔗 **Swagger Url:** [http://localhost:YOUR_PORT/api-docs](http://localhost:<PORT>/api-docs)

> ⚠️ The Swagger UI is protected with Basic Auth.
>
> Use the following credentials defined in your `.env` file:
>
> - **PORT:** `PORT`
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
