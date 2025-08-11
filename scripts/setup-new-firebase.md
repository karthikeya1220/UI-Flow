# 🔥 Firebase Setup Solution

## 🚨 Current Issue
Your Firebase project `ui-flow-272f0` is returning `CONFIGURATION_NOT_FOUND` errors, meaning either:
- The project doesn't exist
- Authentication is not enabled
- The API key is invalid

## ✅ SOLUTION: Create New Firebase Project

### Step 1: Create New Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Project name: `ui-flow-new` (or any name you prefer)
4. **Disable Google Analytics** for now (can enable later)
5. Click **"Create project"**

### Step 2: Enable Authentication
1. In your new Firebase project, go to **"Authentication"**
2. Click **"Get started"** 
3. Go to **"Sign-in method"** tab
4. Click on **"Google"**
5. Toggle **"Enable"**
6. Set **"Project support email"** (required for Google Sign-in)
7. Click **"Save"**

### Step 3: Configure Web App
1. Go to **Project Settings** (gear icon ⚙️)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** → **Web** (`</>` icon)
4. App nickname: `UI Flow Web`
5. **Don't** check "Set up Firebase Hosting"
6. Click **"Register app"**
7. **COPY** the configuration object that appears

### Step 4: Update Environment Variables
Replace your `.env.local` with the new configuration:

```bash
# NEW Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_new_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-new-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-new-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-new-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxxx:web:xxxxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Keep existing Database Configuration
NEXT_PUBLIC_NEON_DB_CONNECTION_STRING=postgresql://neondb_owner:npg_aGKB6bRSs1on@ep-polished-base-a1bqw0bx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DATABASE_URL=postgresql://neondb_owner:npg_aGKB6bRSs1on@ep-polished-base-a1bqw0bx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Keep existing API Configuration  
OPENROUTER_AI_API_KEY=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

# Keep existing Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Keep existing Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=10
```

### Step 5: Add Authorized Domains
1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add these domains:
   - `localhost` (for development)
   - Any production domain you plan to use

### Step 6: Test the Setup
1. Save the new `.env.local` file
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Try signing in with Google

## 🔧 Alternative: Fix Current Project (if it exists)

If you want to keep the current project `ui-flow-272f0`:

1. Go to [Firebase Console](https://console.firebase.google.com/project/ui-flow-272f0)
2. If the project exists, enable Authentication as described above
3. If the project doesn't exist, you must create a new one

## ✅ After Setup

Your authentication should work properly. The error `auth/configuration-not-found` will be resolved.

## 🐛 Still Having Issues?

If you still get errors after setup:
1. Check browser console for additional error details
2. Verify all environment variables are correctly set
3. Ensure the Firebase project has Authentication enabled
4. Make sure Google Sign-in provider is enabled in Firebase Console
