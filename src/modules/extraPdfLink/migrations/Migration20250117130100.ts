import { Migration } from '@mikro-orm/migrations';

export class Migration20250117130100 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "extra_link" ("id" text not null, "amazoneLink" text null, "youtubeLink" text null, "previewPdf" text null, "questionBankPdf" text null, "anypdf" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "extra_link_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_extra_link_deleted_at" ON "extra_link" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('drop table if exists "extralinks" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table if not exists "extralinks" ("id" text not null, "amazoneLink" text null, "youtubeLink" text null, "previewPdf" text null, "questionBankPdf" text null, "anypdf" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "extralinks_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_extralinks_deleted_at" ON "extralinks" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('drop table if exists "extra_link" cascade;');
  }

}
