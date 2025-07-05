import { Migration } from '@mikro-orm/migrations';

export class Migration20250705093944 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "priority_author" drop column if exists "priority";');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "priority_author" add column if not exists "priority" integer not null;');
  }

}
