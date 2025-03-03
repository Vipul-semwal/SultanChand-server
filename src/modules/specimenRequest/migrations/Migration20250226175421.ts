import { Migration } from '@mikro-orm/migrations';

export class Migration20250226175421 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "specimen_request" ("id" text not null, "category_name" text not null, "school_name" text not null, "state" text not null, "residence_address" text not null, "phone_number" text not null, "email" text not null, "title_name" text not null, "strength" text not null, "name" text not null, "school_address" text not null, "city" text not null, "pin_code" text not null, "mobile_number" text not null, "title_category" text not null, "letter_head" text not null, "photo_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "specimen_request_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_specimen_request_deleted_at" ON "specimen_request" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "specimen_request" cascade;');
  }

}
