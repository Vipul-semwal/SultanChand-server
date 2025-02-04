import { Migration } from '@mikro-orm/migrations';

export class Migration20250116185513 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "review" ("id" text not null, "rating" integer not null, "comment" text not null, "bookId" text not null, "userId" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "review_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_review_deleted_at" ON "review" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "review" cascade;');
  }

}
