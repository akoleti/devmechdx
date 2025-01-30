import { sql } from 'drizzle-orm';
import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export async function up(db) {
  await db.schema.alterTable('users').addColumns({
    resetPasswordToken: varchar('reset_password_token').unique(),
    resetPasswordExpires: timestamp('reset_password_expires'),
  });
}

export async function down(db) {
  await db.schema.alterTable('users').dropColumns(['reset_password_token', 'reset_password_expires']);
} 