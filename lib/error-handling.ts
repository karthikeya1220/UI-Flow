import { NextRequest, NextResponse } from 'next/server';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleApiError = (error: unknown) => {
    console.error('API Error:', error);

    if (error instanceof AppError) {
        return NextResponse.json(
            { 
                error: error.message,
                status: 'error'
            },
            { status: error.statusCode }
        );
    }

    // Database errors
    if (error instanceof Error && error.message.includes('duplicate key')) {
        return NextResponse.json(
            { 
                error: 'Resource already exists',
                status: 'error'
            },
            { status: 409 }
        );
    }

    // Network or external API errors
    if (error instanceof Error && error.message.includes('fetch')) {
        return NextResponse.json(
            { 
                error: 'External service unavailable',
                status: 'error'
            },
            { status: 503 }
        );
    }

    // Default error
    return NextResponse.json(
        { 
            error: process.env.NODE_ENV === 'production' 
                ? 'Something went wrong' 
                : error instanceof Error ? error.message : 'Unknown error',
            status: 'error'
        },
        { status: 500 }
    );
};

export const validateRequest = (fields: Record<string, any>, requiredFields: string[]) => {
    const missingFields = requiredFields.filter(field => !fields[field] || fields[field] === '');
    
    if (missingFields.length > 0) {
        throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }
};

export const rateLimitCheck = (req: NextRequest, key: string) => {
    // Simple rate limiting - in production, use Redis or similar
    const windowStart = Date.now() - parseInt(process.env.RATE_LIMIT_WINDOW || '900000');
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10');
    
    // This is a simplified version - implement proper rate limiting with Redis in production
    return true; // For now, always allow requests
};
