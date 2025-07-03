import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBooksTable20240928124500 implements MigrationInterface {
  name = 'CreateBooksTable20240928124500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "books" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "title" VARCHAR NOT NULL,
        "isbn" VARCHAR NOT NULL,
        "published_date" DATE,
        "genre" VARCHAR,
        "author_id" INTEGER NOT NULL,
        "is_deleted" BOOLEAN NOT NULL DEFAULT 0,
        "created_at" DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        CONSTRAINT "UQ_books_isbn" UNIQUE ("isbn"),
        CONSTRAINT "FK_books_author_id"
          FOREIGN KEY ("author_id")
          REFERENCES "authors" ("id")
          ON DELETE CASCADE
          ON UPDATE NO ACTION
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "books"`);
  }
}
