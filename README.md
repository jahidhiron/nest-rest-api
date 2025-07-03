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
│   ├── common/                                    # Cross‑cutting utilities shared by all feature modules
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
│   │   │   └── base.repository.ts                 # Generic TypeORM repository with soft‑delete helpers
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
│   │   │   ├── providers/                         # Business‑logic “services” (split for testability)
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

### Unit Tests

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
