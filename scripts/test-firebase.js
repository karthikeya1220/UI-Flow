// Test Firebase Configuration
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('=== Firebase Configuration Test ===');
console.log('API Key:', firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 20)}...` : 'MISSING');
console.log('Auth Domain:', firebaseConfig.authDomain || 'MISSING');
console.log('Project ID:', firebaseConfig.projectId || 'MISSING');
console.log('Storage Bucket:', firebaseConfig.storageBucket || 'MISSING');
console.log('Messaging Sender ID:', firebaseConfig.messagingSenderId || 'MISSING');
console.log('App ID:', firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 20)}...` : 'MISSING');
console.log('Measurement ID:', firebaseConfig.measurementId || 'MISSING');

// Check for missing values
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
    console.error('\n❌ ERROR: Missing required Firebase configuration:');
    missingKeys.forEach(key => console.error(`  - ${key}`));
    process.exit(1);
} else {
    console.log('\n✅ All required Firebase configuration values are present');
}

// Test API key format
if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('AIza')) {
    console.warn('\n⚠️  WARNING: API key doesn\'t appear to be a valid Firebase API key');
}

// Test project ID format
if (firebaseConfig.projectId && firebaseConfig.projectId.includes('.')) {
    console.warn('\n⚠️  WARNING: Project ID contains dots, which might cause issues');
}

console.log('\n=== Configuration Test Complete ===');
