import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVerificationTokenEntity1698483600000
  implements MigrationInterface
{
  name = 'CreateVerificationTokenEntity1698483600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "verification_tokens" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "token" varchar NOT NULL,
        "ip" varchar NOT NULL,
        "expired_at" datetime NOT NULL,
        "applied" boolean NOT NULL DEFAULT 0,
        "verified" boolean NOT NULL DEFAULT 0,
        "type" varchar NOT NULL,
        "user_id" integer NOT NULL,
        "is_deleted" boolean NOT NULL DEFAULT 0,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        CONSTRAINT "FK_verification_tokens_user" 
          FOREIGN KEY ("user_id") 
          REFERENCES "users" ("id") 
          ON DELETE CASCADE 
          ON UPDATE NO ACTION
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "verification_tokens"`);
  }
}
