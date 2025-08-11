# 🔧 Fix Supabase Storage RLS Error

## Problem
You're getting this error: `new row violates row-level security policy`

This happens because your Supabase Storage bucket has Row Level Security (RLS) enabled but no policies are configured.

## 🚀 Quick Fix (Option 1: Disable RLS - Easiest)

### Step 1: Go to Supabase Dashboard
1. Open [your Supabase project](https://supabase.com/dashboard/project/wdzlvxpugvcinfqizleu)
2. Go to **Storage** → **Buckets**
3. Find your `wireframes` bucket

### Step 2: Disable RLS (Public Bucket)
1. Click on the `wireframes` bucket
2. Go to **Configuration** tab
3. Toggle **"Public bucket"** to **ON**
4. This automatically disables RLS and allows public read/write

## 🛡️ Secure Fix (Option 2: Configure RLS Policies)

If you prefer to keep RLS enabled for security, follow these steps:

### Step 1: Go to Storage Policies
1. In your Supabase dashboard, go to **Storage** → **Policies**
2. Select the `wireframes` bucket

### Step 2: Add Upload Policy
Click **"New policy"** and add this policy for uploads:

```sql
-- Policy Name: "Allow authenticated users to upload wireframes"
-- Policy Type: INSERT
CREATE POLICY "Allow authenticated users to upload wireframes" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'wireframes' 
    AND auth.role() = 'authenticated'
);
```

### Step 3: Add Read Policy
Add another policy for reading files:

```sql
-- Policy Name: "Allow public read access to wireframes"  
-- Policy Type: SELECT
CREATE POLICY "Allow public read access to wireframes" ON storage.objects
FOR SELECT USING (bucket_id = 'wireframes');
```

### Step 4: Add Update Policy (Optional)
If you need to update files:

```sql
-- Policy Name: "Allow authenticated users to update wireframes"
-- Policy Type: UPDATE  
CREATE POLICY "Allow authenticated users to update wireframes" ON storage.objects
FOR UPDATE WITH CHECK (
    bucket_id = 'wireframes' 
    AND auth.role() = 'authenticated'
);
```

### Step 5: Add Delete Policy (Optional)
If you need to delete files:

```sql
-- Policy Name: "Allow authenticated users to delete wireframes"
-- Policy Type: DELETE
CREATE POLICY "Allow authenticated users to delete wireframes" ON storage.objects
FOR DELETE USING (
    bucket_id = 'wireframes' 
    AND auth.role() = 'authenticated'
);
```

## 🎯 Recommended Solution

**For development**: Use Option 1 (Public bucket) - it's simpler and faster to set up.

**For production**: Use Option 2 (RLS policies) - more secure but requires authentication.

## 🔄 Alternative: Allow Anonymous Uploads

If you want to allow uploads without authentication (not recommended for production):

```sql
-- Policy Name: "Allow anyone to upload wireframes"
-- Policy Type: INSERT
CREATE POLICY "Allow anyone to upload wireframes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'wireframes');
```

## ✅ Test the Fix

After implementing either option:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Try uploading an image in your app
3. Check the browser console for success messages
4. Verify files appear in Supabase Storage dashboard

## 🐛 Still Having Issues?

If the problem persists:

1. **Check bucket name**: Ensure it's exactly `wireframes` (case-sensitive)
2. **Verify environment variables**: Make sure your Supabase URL and key are correct
3. **Check authentication**: If using RLS policies, ensure user is authenticated
4. **Browser network tab**: Check for more detailed error messages

---

✨ **Choose Option 1 for quick testing, Option 2 for production security!**
