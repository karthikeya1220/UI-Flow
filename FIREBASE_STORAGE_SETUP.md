# Firebase Storage Setup Guide

## Current Issue
Firebase Storage is failing with CORS errors. This happens when:

1. **Firebase Storage is not enabled**
2. **Storage bucket doesn't exist**
3. **CORS configuration is not set up**
4. **Authentication rules are too restrictive**

## 🚀 Quick Fix: Enable Firebase Storage

### Step 1: Enable Storage in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ui-flow-272f0`
3. In the left sidebar, click **"Storage"**
4. Click **"Get started"**
5. Choose **"Start in test mode"** (for development)
6. Select a location (use same as your project location)
7. Click **"Done"**

### Step 2: Configure Storage Rules (Development)
In Firebase Console → Storage → Rules, set these rules for development:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 3: Configure CORS (if needed)
If CORS issues persist, you might need to configure CORS on the storage bucket:

1. Install Google Cloud SDK
2. Run this command:
```bash
gsutil cors set cors.json gs://ui-flow-272f0.appspot.com
```

Create `cors.json`:
```json
[
  {
    "origin": ["http://localhost:3000", "https://your-domain.com"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

### Step 4: Production Storage Rules
For production, use more secure rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /Wireframe_To_Code/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## ✅ Current Fallback Solution

The app now has a fallback mechanism:

1. **First tries Firebase Storage** (if properly configured)
2. **Falls back to base64 encoding** (if Storage fails)

This ensures the app works even if Storage isn't set up yet.

## 🔧 Testing Storage

After enabling Storage, you can test it:

1. Restart your development server: `npm run dev`
2. Try uploading an image
3. Check the console for success messages
4. Check Firebase Console → Storage to see uploaded files

## 📝 Storage Bucket URL

Your storage bucket should be:
- **Name**: `ui-flow-272f0.appspot.com` (from your .env.local)
- **URL**: `https://firebasestorage.googleapis.com/v0/b/ui-flow-272f0.appspot.com/o/`

## 🆘 If Storage Still Fails

The app will automatically use base64 encoding as a fallback, so image processing will still work, but:

- Images won't be permanently stored
- File sizes will be larger
- Performance may be slower

**Recommendation**: Set up Firebase Storage properly for the best experience.

---

💡 **Pro Tip**: You can check if Storage is working by looking at the console logs. You'll see either "Image uploaded to Firebase Storage" or "Using local image processing (Firebase Storage unavailable)".
