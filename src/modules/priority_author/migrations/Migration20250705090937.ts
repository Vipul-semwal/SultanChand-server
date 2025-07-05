import { Migration } from '@mikro-orm/migrations';

export class Migration20250705090937 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "priority_author" ("id" text not null, "authors" jsonb not null default \'{"list":[]}\', "priority" integer not null, "key" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "priority_author_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_priority_author_key_unique" ON "priority_author" (key) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_priority_author_deleted_at" ON "priority_author" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "priority_author" cascade;');
  }

}
