import { Migration } from '@mikro-orm/migrations';

export class Migration20250111153228 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "author" ("id" text not null, "name" text not null, "description" text not null, "image" text not null, "subText" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "author_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_author_deleted_at" ON "author" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "author" cascade;');
  }

}
