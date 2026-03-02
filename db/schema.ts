import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Email subscribers table for CTA newsletter signup
export const emailSubscribers = pgTable('email_subscribers', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type NewEmailSubscriber = typeof emailSubscribers.$inferInsert;