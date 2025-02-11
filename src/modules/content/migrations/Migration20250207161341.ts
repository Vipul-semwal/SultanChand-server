import { Migration } from '@mikro-orm/migrations';

export class Migration20250207161341 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "content" ("id" text not null, "product_id" text not null, "content" jsonb not null, "version" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "content_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_content_deleted_at" ON "content" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "content" cascade;');
  }

}
