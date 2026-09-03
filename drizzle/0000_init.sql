-- UI Flow: Initial schema
-- Run this against your Neon/PostgreSQL database

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    credits INTEGER DEFAULT 3
);

CREATE TABLE IF NOT EXISTS "wireframeToCode" (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    uid VARCHAR,
    "imageUrl" VARCHAR,
    model VARCHAR,
    description VARCHAR,
    code JSONB,
    "createdBy" VARCHAR
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wireframe_createdby ON "wireframeToCode"("createdBy");
CREATE INDEX IF NOT EXISTS idx_wireframe_uid ON "wireframeToCode"(uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS (Supabase requirement)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE "wireframeToCode" ENABLE ROW LEVEL SECURITY;

-- Policies: allow service_role full access (API routes use service role)
CREATE POLICY "Service role full access" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON "wireframeToCode" FOR ALL USING (true) WITH CHECK (true);
