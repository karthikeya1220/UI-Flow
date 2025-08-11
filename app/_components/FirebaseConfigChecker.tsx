"use client"
import React, { useEffect, useState } from 'react';

interface ConfigStatus {
    key: string;
    value: string | undefined;
    status: 'present' | 'missing' | 'invalid';
}

function FirebaseConfigChecker() {
    const [configStatus, setConfigStatus] = useState<ConfigStatus[]>([]);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkConfig = () => {
            const configs: ConfigStatus[] = [
                {
                    key: 'NEXT_PUBLIC_FIREBASE_API_KEY',
                    value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                    status: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'present' : 'missing'
                },
                {
                    key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
                    value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                    status: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'present' : 'missing'
                },
                {
                    key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
                    value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    status: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'present' : 'missing'
                },
                {
                    key: 'NEXT_PUBLIC_FIREBASE_APP_ID',
                    value: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
                    status: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'present' : 'missing'
                }
            ];

            // Additional validation
            configs.forEach(config => {
                if (config.status === 'present') {
                    if (config.key === 'NEXT_PUBLIC_FIREBASE_API_KEY' && 
                        (!config.value?.startsWith('AIza') || config.value.length < 30)) {
                        config.status = 'invalid';
                    } else if (config.key === 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN' && 
                        !config.value?.includes('firebaseapp.com')) {
                        config.status = 'invalid';
                    } else if (config.key === 'NEXT_PUBLIC_FIREBASE_PROJECT_ID' && 
                        (config.value?.length || 0) < 3) {
                        config.status = 'invalid';
                    }
                }
            });

            setConfigStatus(configs);
            setIsChecking(false);
        };

        checkConfig();
    }, []);

    if (isChecking) {
        return <div>Checking Firebase configuration...</div>;
    }

    const hasIssues = configStatus.some(config => config.status !== 'present');

    return (
        <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Firebase Configuration Status</h3>
            
            {hasIssues && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
                    <strong>⚠️ Configuration Issues Detected</strong>
                    <p className="text-sm mt-1">
                        Please check your .env.local file and follow the setup guide in scripts/setup-firebase.md
                    </p>
                </div>
            )}
            
            <div className="space-y-2">
                {configStatus.map((config) => (
                    <div key={config.key} className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full ${
                            config.status === 'present' ? 'bg-green-500' :
                            config.status === 'invalid' ? 'bg-red-500' : 'bg-gray-400'
                        }`}></span>
                        <span className="text-sm font-mono">{config.key}</span>
                        <span className={`text-sm ${
                            config.status === 'present' ? 'text-green-600' :
                            config.status === 'invalid' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                            {config.status === 'present' ? '✓ Present' :
                             config.status === 'invalid' ? '✗ Invalid' : '✗ Missing'}
                        </span>
                    </div>
                ))}
            </div>

            {!hasIssues && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded">
                    <strong>✅ Configuration looks good!</strong>
                    <p className="text-sm mt-1">
                        If you're still experiencing issues, the problem might be with the Firebase project setup.
                    </p>
                </div>
            )}
        </div>
    );
}

export default FirebaseConfigChecker;
