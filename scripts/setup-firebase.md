# Firebase Setup Instructions

## The current Firebase configuration is causing authentication errors. Here's how to fix it:

### Option 1: Create a New Firebase Project (Recommended)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create a new project**:
   - Click "Add project"
   - Project name: `ui-flow-v2` (or any name you prefer)
   - Disable Google Analytics for now (can enable later)
   - Click "Create project"

3. **Enable Authentication**:
   - In the Firebase console, go to "Authentication"
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable "Google" sign-in method
   - Add your authorized domains (localhost:3000 for development)

4. **Get new configuration**:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click "Add app" → Web (</>) icon
   - Register app with nickname: "UI Flow Web"
   - Copy the configuration object

5. **Update your .env.local file** with the new configuration values

### Option 2: Fix Current Project

1. **Go to your current project**: https://console.firebase.google.com/project/ui-flow-272f0
2. **Check Authentication setup**:
   - Go to Authentication
   - Ensure Google sign-in method is enabled
   - Add localhost:3000 to authorized domains
3. **Regenerate Web App Configuration**:
   - Go to Project Settings
   - Find your web app or create a new one
   - Copy the new configuration

### Current Issues Detected:
- Firebase project configuration not found
- Authentication method may not be properly enabled
- API key might be invalid or restricted

### After updating configuration:
1. Update .env.local with new values
2. Restart your development server
3. Test authentication
