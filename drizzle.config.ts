import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

export default defineConfig({
    schema: './configs/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING!,
    },
});
