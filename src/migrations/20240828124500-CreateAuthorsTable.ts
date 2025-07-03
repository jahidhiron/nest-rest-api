import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthorsTable20240828124500 implements MigrationInterface {
  name = 'CreateAuthorsTable20240828124500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "authors" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "first_name" VARCHAR NOT NULL,
        "last_name" VARCHAR NOT NULL,
        "bio" TEXT,
        "birth_date" DATE,
        "user_id" INTEGER NOT NULL,
        "is_deleted" BOOLEAN NOT NULL DEFAULT 0,
        "created_at" DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        CONSTRAINT "FK_authors_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "authors"`);
  }
}
