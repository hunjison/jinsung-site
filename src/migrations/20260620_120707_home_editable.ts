import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`home_strengths\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_strengths_order_idx\` ON \`home_strengths\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_strengths_parent_id_idx\` ON \`home_strengths\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_strengths_image_idx\` ON \`home_strengths\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_product_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_product_cards_order_idx\` ON \`home_product_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_product_cards_parent_id_idx\` ON \`home_product_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_product_cards_image_idx\` ON \`home_product_cards\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`home\` ADD \`hero_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`home\` ADD \`hero_title\` text;`)
  await db.run(sql`ALTER TABLE \`home\` ADD \`hero_subtitle\` text;`)
  await db.run(sql`ALTER TABLE \`home\` ADD \`strengths_title\` text;`)
  await db.run(sql`ALTER TABLE \`home\` ADD \`strengths_subtitle\` text;`)
  await db.run(sql`ALTER TABLE \`home\` ADD \`products_title\` text;`)
  await db.run(sql`ALTER TABLE \`home\` ADD \`products_subtitle\` text;`)
  await db.run(sql`ALTER TABLE \`home\` ADD \`video_title\` text;`)
  await db.run(sql`ALTER TABLE \`home\` ADD \`video_subtitle\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`home_strengths\`;`)
  await db.run(sql`DROP TABLE \`home_product_cards\`;`)
  await db.run(sql`ALTER TABLE \`home\` DROP COLUMN \`hero_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`home\` DROP COLUMN \`hero_title\`;`)
  await db.run(sql`ALTER TABLE \`home\` DROP COLUMN \`hero_subtitle\`;`)
  await db.run(sql`ALTER TABLE \`home\` DROP COLUMN \`strengths_title\`;`)
  await db.run(sql`ALTER TABLE \`home\` DROP COLUMN \`strengths_subtitle\`;`)
  await db.run(sql`ALTER TABLE \`home\` DROP COLUMN \`products_title\`;`)
  await db.run(sql`ALTER TABLE \`home\` DROP COLUMN \`products_subtitle\`;`)
  await db.run(sql`ALTER TABLE \`home\` DROP COLUMN \`video_title\`;`)
  await db.run(sql`ALTER TABLE \`home\` DROP COLUMN \`video_subtitle\`;`)
}
