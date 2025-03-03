import { Migration } from '@mikro-orm/migrations';

export class Migration20250228185507 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "isbn" ("id" text not null, "number" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "isbn_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_isbn_deleted_at" ON "isbn" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "isbn" cascade;');
  }

}
