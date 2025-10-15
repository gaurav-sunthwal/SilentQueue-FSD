import { pgTable, serial, text, boolean, doublePrecision, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Define the queue_status enum
export const queueStatusEnum = pgEnum('queue_status', [
  'waiting',
  'notified', 
  'serving',
  'done',
  'skipped',
  'abandoned'
]);

// Businesses table
export const businesses = pgTable('businesses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull().default('Service'),
  address: text('address').notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  avgServiceTime: integer('avg_service_time').notNull().default(7), // minutes per person
  isOpen: boolean('is_open').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Queue entries table
export const queueEntries = pgTable('queue_entries', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  customerName: text('customer_name').notNull(),
  phone: text('phone'),
  status: queueStatusEnum('status').notNull().default('waiting'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  notifiedAt: timestamp('notified_at', { withTimezone: true }),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

// Export types for TypeScript
export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;
export type QueueEntry = typeof queueEntries.$inferSelect;
export type NewQueueEntry = typeof queueEntries.$inferInsert;
