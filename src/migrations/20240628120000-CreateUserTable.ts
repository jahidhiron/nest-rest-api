import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserEntity1698480000000 implements MigrationInterface {
  name = 'CreateUserEntity1698480000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "first_name" varchar NOT NULL,
        "last_name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "role" varchar NOT NULL,
        "avatar" varchar,
        "password" varchar NOT NULL,
        "verified" boolean NOT NULL DEFAULT 0,
        "is_deleted" boolean NOT NULL DEFAULT 0,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
