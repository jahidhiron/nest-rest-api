import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLoginHistoryEntity1698487200000
  implements MigrationInterface
{
  name = 'CreateLoginHistoryEntity1698487200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "login_histories" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "is_deleted" boolean NOT NULL DEFAULT 0,
        "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "updated_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        "ip" varchar NOT NULL,
        "device_info" varchar,
        "logged_out_at" datetime,
        "user_id" integer NOT NULL,
        CONSTRAINT "FK_login_histories_user" 
          FOREIGN KEY ("user_id") 
          REFERENCES "users" ("id") 
          ON DELETE CASCADE 
          ON UPDATE NO ACTION
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "login_histories"`);
  }
}
