# Firebase Authentication Setup Guide

## Current Issue
The error `auth/configuration-not-found` typically occurs when:
1. The Firebase project doesn't exist
2. Authentication is not enabled in Firebase Console
3. Google Sign-In provider is not configured
4. The API key doesn't have the correct permissions

## Steps to Fix

### 1. Verify Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Make sure your project `ui-flow-272f0` exists
3. If it doesn't exist, create a new project

### 2. Enable Authentication
1. In Firebase Console, go to **Authentication** → **Get Started**
2. Go to **Sign-in method** tab
3. Enable **Google** as a sign-in provider
4. Set the **Project support email** (required for Google Sign-in)

### 3. Configure Authorized Domains
1. In **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain (if any)

### 4. Web App Configuration
1. Go to **Project settings** (gear icon)
2. In **Your apps** section, make sure you have a Web app
3. If not, click **Add app** → **Web**
4. Copy the configuration and verify it matches your .env.local

### 5. API Key Permissions
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your API key and ensure these APIs are enabled:
   - Identity and Access Management (IAM) API
   - Firebase Authentication API
   - Cloud Resource Manager API

## Current Configuration
Your `.env.local` file has:
- API Key: AIzaSyBNv7eq5mXXxRVyjpM8EWNfSuVgpkDDwVQ
- Project ID: ui-flow-272f0
- Auth Domain: ui-flow-272f0.firebaseapp.com

## Testing
After completing the setup, test by running:
```bash
npm run dev
```

Then try signing in. Check the browser console for any additional errors.

## Alternative Solution
If the issue persists, you may need to:
1. Create a new Firebase project
2. Update all environment variables
3. Re-enable authentication with Google provider
