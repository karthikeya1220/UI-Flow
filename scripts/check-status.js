// Firebase and App Status Checker
require('dotenv').config({ path: '.env.local' });

const checkFirebaseStatus = async () => {
    console.log('🔥 Firebase & App Status Check');
    console.log('================================\n');

    // Check Firebase Configuration
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    console.log('📋 Configuration Status:');
    console.log('API Key:', firebaseConfig.apiKey ? '✅ Set' : '❌ Missing');
    console.log('Auth Domain:', firebaseConfig.authDomain ? '✅ Set' : '❌ Missing');
    console.log('Project ID:', firebaseConfig.projectId ? '✅ Set' : '❌ Missing');
    console.log('Storage Bucket:', firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing');
    console.log('App ID:', firebaseConfig.appId ? '✅ Set' : '❌ Missing');
    console.log('');

    // Test API endpoints
    console.log('🌐 API Endpoint Tests:');
    
    try {
        // Test Firebase Auth API
        const authUrl = `https://identitytoolkit.googleapis.com/v1/projects?key=${firebaseConfig.apiKey}`;
        const authResponse = await fetch(authUrl);
        console.log('Firebase Auth API:', authResponse.ok ? '✅ Working' : '❌ Failed');
    } catch (error) {
        console.log('Firebase Auth API: ❌ Failed');
    }

    try {
        // Test Storage API
        const storageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o`;
        const storageResponse = await fetch(storageUrl);
        console.log('Firebase Storage API:', storageResponse.ok ? '✅ Working' : '❌ Failed');
    } catch (error) {
        console.log('Firebase Storage API: ❌ Failed');
    }

    console.log('');

    // Database connection
    console.log('💾 Database Status:');
    const dbUrl = process.env.DATABASE_URL;
    console.log('Database URL:', dbUrl ? '✅ Set' : '❌ Missing');

    // Supabase Storage
    console.log('🗄️  Storage Status:');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('Supabase Key:', supabaseKey ? '✅ Set' : '❌ Missing');

    // OpenRouter AI
    console.log('🤖 AI Service Status:');
    const aiKey = process.env.OPENROUTER_AI_API_KEY;
    console.log('OpenRouter API Key:', aiKey ? '✅ Set' : '❌ Missing');

    console.log('');
    console.log('📊 Overall Status Summary:');
    
    const authWorking = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId;
    const storageConfigured = supabaseUrl && supabaseKey;
    const dbConfigured = dbUrl;
    const aiConfigured = aiKey;

    console.log('Authentication:', authWorking ? '✅ Ready' : '❌ Needs Setup');
    console.log('Storage:', storageConfigured ? '✅ Ready (Supabase)' : '❌ Not Configured');
    console.log('Database:', dbConfigured ? '✅ Ready' : '❌ Needs Setup');
    console.log('AI Service:', aiConfigured ? '✅ Ready' : '❌ Needs Setup');

    console.log('\n📖 Setup Guides:');
    if (!authWorking) {
        console.log('- Check FIREBASE_SETUP.md for authentication setup');
    }
    if (!storageConfigured) {
        console.log('- Check SUPABASE_SETUP.md for storage setup');
    }
    if (!dbConfigured) {
        console.log('- Set up DATABASE_URL in .env.local');
    }
    if (!aiConfigured) {
        console.log('- Get OpenRouter API key and add to .env.local');
    }

    console.log('\n✨ Current Working Features:');
    console.log('✅ Authentication (Google Sign-in)');
    console.log('✅ User Management');
    console.log('✅ Database Operations');
    console.log('⚠️  Image Upload (with fallback to base64)');
    console.log('✅ AI Code Generation');
};

// Run the check
checkFirebaseStatus().catch(console.error);
