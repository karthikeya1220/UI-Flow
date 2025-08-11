import { drizzle } from 'drizzle-orm/neon-http';

const connectionString = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING;
if (!connectionString) {
    throw new Error('Database connection string is not configured');
}

export const db = drizzle(connectionString);