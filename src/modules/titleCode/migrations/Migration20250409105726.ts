import { Migration } from '@mikro-orm/migrations';

export class Migration20250409105726 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "title_code" ("id" text not null, "code" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "title_code_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_title_code_deleted_at" ON "title_code" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "title_code" cascade;');
  }

}
