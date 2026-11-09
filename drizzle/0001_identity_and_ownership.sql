-- Migration: 0001_identity_and_ownership.sql
-- Description: Add supabase_id to users and user_id FK to wireframeToCode with backfill

-- 1. Add supabase_id UUID UNIQUE to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_id UUID UNIQUE;

-- 2. Add user_id INTEGER REFERENCES users(id) ON DELETE CASCADE to wireframeToCode
ALTER TABLE "wireframeToCode" ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- 3. Backfill user_id from createdBy email for existing records
UPDATE "wireframeToCode" w
SET user_id = u.id
FROM users u
WHERE w.user_id IS NULL AND LOWER(w."createdBy") = LOWER(u.email);

-- 4. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_users_supabase_id ON users(supabase_id);
CREATE INDEX IF NOT EXISTS idx_wireframe_user_id ON "wireframeToCode"(user_id);

