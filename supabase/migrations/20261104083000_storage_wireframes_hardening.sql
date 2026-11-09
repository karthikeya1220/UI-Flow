-- ==============================================================================
-- UIFlow: Private Wireframes Storage Bucket and Ownership RLS Policies
-- Target Database: Supabase Project jwphfqkxlkrdnzozrjoe (Storage Schema)
-- Description:
--   1. Ensures private 'wireframes' bucket exists with 5MB cap & MIME restrictions
--   2. Enables Row Level Security on storage.objects
--   3. Enforces strict user isolation: (storage.foldername(name))[1] = auth.uid()::text
-- ==============================================================================

-- 1. Create or update private 'wireframes' storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'wireframes', 
    'wireframes', 
    false, 
    5242880, 
    ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp'];

-- 2. Ensure RLS is active on storage.objects

-- 3. Clean up any existing policies on the 'wireframes' bucket to avoid permissive overlaps
DROP POLICY IF EXISTS "Users can upload wireframes to own directory" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own wireframes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own wireframes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own wireframes" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to upload wireframes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to wireframes" ON storage.objects;

-- 4. INSERT Policy: Authenticated users can upload ONLY into their own folder (folder name == auth.uid())
CREATE POLICY "Users can upload wireframes to own directory"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'wireframes'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. SELECT Policy: Authenticated users can read/download ONLY files in their own folder
CREATE POLICY "Users can view own wireframes"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'wireframes'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 6. UPDATE Policy: Enforce ownership on BOTH existing row and resulting row
CREATE POLICY "Users can update own wireframes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'wireframes'
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'wireframes'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 7. DELETE Policy: Authenticated users can delete ONLY files from their own folder
CREATE POLICY "Users can delete own wireframes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'wireframes'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

