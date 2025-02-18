import { Migration } from '@mikro-orm/migrations';

export class Migration20250212141534 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "book_content" ("id" text not null, "product_id" text not null, "content" jsonb not null, "version" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "book_content_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_book_content_deleted_at" ON "book_content" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('drop table if exists "content" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table if not exists "content" ("id" text not null, "product_id" text not null, "content" jsonb not null, "version" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "content_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_content_deleted_at" ON "content" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('drop table if exists "book_content" cascade;');
  }

}
