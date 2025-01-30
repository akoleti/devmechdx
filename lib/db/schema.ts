import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  email: varchar('email').notNull().unique(),
  resetPasswordToken: varchar('reset_password_token').unique(),
  resetPasswordExpires: timestamp('reset_password_expires'),
}); 