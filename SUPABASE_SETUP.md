# 🗄️ Supabase Storage Setup Guide

## Overview
This guide will help you set up Supabase Storage to replace Firebase Storage in your wireframe-to-code application.

## 🚀 Quick Setup Steps

### Step 1: Create a Supabase Project
1. Go to [Supabase](https://supabase.com/)
2. Click **"New project"**
3. Choose your organization (or create one)
4. Fill in project details:
   - **Name**: `ui-flow-storage` (or any name you prefer)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait for the project to be ready (~2 minutes)

### Step 2: Get Your Project Credentials
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Project API Keys** → **anon public**: `eyJ...` (this is safe to use in frontend)

### Step 3: Update Environment Variables
Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 4: Create Storage Bucket
1. In Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Bucket details:
   - **Name**: `wireframes`
   - **Public bucket**: ✅ **Enable** (for easy public access)
   - **File size limit**: 50 MB (adjust as needed)
   - **Allowed MIME types**: `image/*` (or leave empty for all types)
4. Click **"Create bucket"**

### Step 5: Configure Storage Policies (Security)
1. Go to **Storage** → **Policies** tab
2. For the `wireframes` bucket, you can either:

**Option A: Public Access (Easier)**
- Enable "Public bucket" when creating (already done in Step 4)
- Anyone can read files, authenticated users can upload

**Option B: Authenticated Only (More Secure)**
- Add a policy for INSERT (upload):
  ```sql
  -- Allow authenticated users to upload
  CREATE POLICY "Users can upload wireframes" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'wireframes' 
      AND auth.role() = 'authenticated'
    );
  ```
- Add a policy for SELECT (read):
  ```sql
  -- Allow public read access
  CREATE POLICY "Anyone can view wireframes" ON storage.objects
    FOR SELECT USING (bucket_id = 'wireframes');
  ```

### Step 6: Update Next.js Image Domains
In your `next.config.ts`, add your Supabase domain:

```typescript
images: {
  domains: [
    'your-project-ref.supabase.co' // Replace with your actual project ref
  ]
}
```

### Step 7: Test the Setup
1. Restart your development server: `npm run dev`
2. Try uploading an image in your app
3. Check the console for success messages
4. Verify files appear in Supabase Storage dashboard

## 🔧 Configuration Details

### Bucket Structure
Your files will be organized as:
```
wireframes/
  └── Wireframe_To_Code/
      ├── 1640123456789.png
      ├── 1640123456790.png
      └── ...
```

### File URLs
Supabase provides public URLs in this format:
```
https://your-project-ref.supabase.co/storage/v1/object/public/wireframes/Wireframe_To_Code/filename.png
```

## ✅ Advantages of Supabase Storage

- **Faster uploads**: Often better performance than Firebase
- **Better pricing**: More generous free tier
- **Integrated**: Works well with Supabase Auth & Database
- **Simple setup**: Fewer configuration steps
- **Real-time**: Built-in real-time subscriptions
- **SQL policies**: More flexible security rules

## 🔄 Migration Benefits

- **No vendor lock-in**: Easier to migrate data if needed  
- **Cost effective**: Supabase typically cheaper for storage
- **Better developer experience**: More intuitive dashboard
- **Modern stack**: Built on PostgreSQL, more flexible

## 🆘 Troubleshooting

### Error: "Invalid JWT"
- Check your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Make sure the key matches your project

### Error: "Bucket not found"
- Ensure you created the `wireframes` bucket
- Check the bucket name matches in your code

### Error: "Policy violation"
- Check your RLS (Row Level Security) policies
- Make sure public access is enabled or policies are correct

### Error: "CORS issues"
- Supabase handles CORS automatically
- Ensure your domain is correct in environment variables

### Upload fails silently
- Check browser network tab for error details
- Verify bucket permissions
- Ensure file size is within limits

## 🎯 Next Steps

After successful setup:

1. **Test thoroughly**: Upload various file types and sizes
2. **Monitor usage**: Check Supabase dashboard for storage usage
3. **Set up backups**: Consider automated backups for important files
4. **Optimize**: Consider image compression before upload
5. **Security**: Review and tighten storage policies for production

## 💡 Pro Tips

- Use the `upsert: false` option to avoid overwriting files
- Implement file size validation on the frontend
- Add image compression for better performance
- Consider implementing file naming conventions
- Use Supabase real-time features for upload progress

---

✨ **You're all set!** Your app now uses Supabase Storage instead of Firebase Storage.
