# 🔥 Firebase Authentication Setup Guide

## Current Issue
Your Firebase project `ui-flow-272f0` is returning a `CONFIGURATION_NOT_FOUND` error. This means:

1. **The Firebase project doesn't exist anymore**, or
2. **Authentication is not properly enabled**, or  
3. **The API key lacks necessary permissions**

## 🚀 Quick Fix: Create New Firebase Project

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `ui-flow-new` (or any name you prefer)
4. Continue through the setup wizard

### Step 2: Enable Authentication
1. In your new project, go to **Authentication** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click on **Google** provider
5. **Enable** the Google sign-in provider
6. Set **Project support email** (required)
7. Click **Save**

### Step 3: Add Web App
1. In project settings (gear icon), go to **"Your apps"**
2. Click **"Add app"** → Select **Web** (</> icon)
3. Enter app nickname: `ui-flow-web`
4. **Check** "Also set up Firebase Hosting" (optional)
5. Click **Register app**

### Step 4: Copy Configuration
After registering, you'll see the Firebase configuration object:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABCDEFGHIJ"
};
```

### Step 5: Update Environment Variables
Replace the values in your `.env.local` file:

```bash
# Firebase Configuration - NEW PROJECT
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ
```

### Step 6: Configure Authorized Domains
1. In Firebase Console → Authentication → Settings
2. Go to **Authorized domains**
3. Add `localhost` (for development)
4. Add your production domain (if any)

### Step 7: Test Authentication
1. Restart your development server: `npm run dev`
2. Try signing in again
3. Check console for any remaining errors

## 🔧 Alternative: Fix Current Project

If you want to fix the existing project `ui-flow-272f0`:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Find your project `ui-flow-272f0`
3. If it doesn't exist, you need to create a new one (follow steps above)
4. If it exists, check Authentication is enabled with Google provider

## 🆘 Troubleshooting

### Error: "Project not found"
- The Firebase project was deleted or never created
- **Solution**: Create a new project

### Error: "Authentication not enabled"
- Authentication service is not set up
- **Solution**: Enable Authentication in Firebase Console

### Error: "Google provider not configured"
- Google sign-in is not enabled
- **Solution**: Enable Google provider in Authentication settings

### Error: "Unauthorized domain"
- Your domain is not in the authorized domains list
- **Solution**: Add domain to authorized domains in Firebase Console

## 📝 Quick Commands

After updating `.env.local`:
```bash
# Test configuration
npm run dev

# Check Firebase config
node scripts/test-firebase.js
```

## 💡 Pro Tips

1. **Keep your API keys secure** - Never commit real API keys to public repositories
2. **Use different projects** for development and production
3. **Enable Analytics** for better insights (optional)
4. **Set up Firestore** if you need a database

---

📞 **Need help?** Check the [Firebase Documentation](https://firebase.google.com/docs/auth/web/start) for more detailed instructions.
