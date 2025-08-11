// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Debug: Log configuration values (only in development)
if (process.env.NODE_ENV === 'development') {
    console.log('Firebase Config Debug:', {
        apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'Missing',
        authDomain: firebaseConfig.authDomain || 'Missing',
        projectId: firebaseConfig.projectId || 'Missing',
        storageBucket: firebaseConfig.storageBucket || 'Missing',
        messagingSenderId: firebaseConfig.messagingSenderId || 'Missing',
        appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 15)}...` : 'Missing',
        measurementId: firebaseConfig.measurementId || 'Missing'
    });
}

// Validate that all required config values are present
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
    console.error('Missing Firebase configuration keys:', missingKeys);
    console.error('Please check your .env.local file and ensure all Firebase environment variables are set correctly.');
    throw new Error(`Firebase configuration incomplete. Missing: ${missingKeys.join(', ')}`);
}

// Initialize Firebase (avoid re-initialization)
let app: FirebaseApp;
try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    console.log('Firebase app initialized successfully');
} catch (error) {
    console.error('Firebase app initialization error:', error);
    throw error;
}

// Initialize Auth
let auth: Auth;
try {
    auth = getAuth(app);
    console.log('Firebase auth initialized successfully');
} catch (error) {
    console.error('Firebase auth initialization error:', error);
    throw error;
}

// Initialize Storage
let storage: FirebaseStorage;
try {
    storage = getStorage(app);
    console.log('Firebase storage initialized successfully');
} catch (error) {
    console.error('Firebase storage initialization error:', error);
    throw error;
}

export { auth, storage };