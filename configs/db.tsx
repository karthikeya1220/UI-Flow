import { drizzle } from 'drizzle-orm/neon-http';

let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
    if (!dbInstance) {
        const connectionString = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error('Database connection string is not configured');
        }
        dbInstance = drizzle(connectionString);
    }
    return dbInstance;
}

// Proxy so `import { db } from "@/configs/db"` keeps working unchanged
export const db = new Proxy({} as any, {
    get(_target, prop) {
        const instance = getDb();
        const value = (instance as any)[prop];
        if (typeof value === 'function') {
            return value.bind(instance);
        }
        return value;
    }
});
