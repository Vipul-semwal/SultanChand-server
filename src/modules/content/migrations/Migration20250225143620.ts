import { Migration } from '@mikro-orm/migrations';

export class Migration20250225143620 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "book_content" ("id" text not null, "content" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "book_content_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_book_content_deleted_at" ON "book_content" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "book_content" cascade;');
  }

}
