import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var __drizzleDb__: ReturnType<typeof drizzle> | undefined
}

export function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL is not set. Please add your Neon connection string in Vars as DATABASE_URL.")
  }
  
  if (!global.__drizzleDb__) {
    const client = postgres(url);
    global.__drizzleDb__ = drizzle(client, { schema });
  }
  
  return global.__drizzleDb__
}

// Legacy function for backward compatibility
export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL is not set. Please add your Neon connection string in Vars as DATABASE_URL.")
  }
  
  // Return a postgres client for raw SQL queries
  return postgres(url);
}
