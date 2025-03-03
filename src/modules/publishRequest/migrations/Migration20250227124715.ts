import { Migration } from '@mikro-orm/migrations';

export class Migration20250227124715 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "publish" ("id" text not null, "author_name" text not null, "institute_name" text not null, "email" text not null, "city" text not null, "country" text not null, "contact_number" text not null, "discipline" text not null, "synopsis" text not null, "about_author" text not null, "author_affiliation" text not null, "address" text not null, "state" text not null, "pin_zip" text not null, "title_of_book" text not null, "subject" text not null, "status_of_book" text check ("status_of_book" in (\'Draft\', \'Published\', \'Under Review\')) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "publish_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_publish_deleted_at" ON "publish" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('drop table if exists "publish_us" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table if not exists "publish_us" ("id" text not null, "author_name" text not null, "institute_name" text not null, "email" text not null, "city" text not null, "country" text not null, "contact_number" text not null, "discipline" text not null, "synopsis" text not null, "about_author" text not null, "author_affiliation" text not null, "address" text not null, "state" text not null, "pin_zip" text not null, "title_of_book" text not null, "subject" text not null, "status_of_book" text check ("status_of_book" in (\'Draft\', \'Published\', \'Under Review\')) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "publish_us_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_publish_us_deleted_at" ON "publish_us" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('drop table if exists "publish" cascade;');
  }

}
