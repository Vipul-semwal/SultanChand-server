import { Migration } from '@mikro-orm/migrations';

export class Migration20250122163404 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "review" add column if not exists "product_id" text not null, add column if not exists "email" text not null, add column if not exists "name" text not null;');
    this.addSql('alter table if exists "review" drop column if exists "bookId";');
    this.addSql('alter table if exists "review" drop column if exists "userId";');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "review" add column if not exists "bookId" text not null, add column if not exists "userId" text not null;');
    this.addSql('alter table if exists "review" drop column if exists "product_id";');
    this.addSql('alter table if exists "review" drop column if exists "email";');
    this.addSql('alter table if exists "review" drop column if exists "name";');
  }

}
