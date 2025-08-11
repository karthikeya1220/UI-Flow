import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { WireframeToCodeTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { AppError, handleApiError, validateRequest } from "@/lib/error-handling";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get('uid');
        const format = searchParams.get('format') || 'jsx';

        if (!uid) {
            throw new AppError('UID parameter is required', 400);
        }

        const result = await db.select()
            .from(WireframeToCodeTable)
            .where(eq(WireframeToCodeTable.uid, uid));

        if (!result[0] || !result[0].code) {
            throw new AppError('Code not found for this wireframe', 404);
        }

        const codeContent = typeof result[0].code === 'object' && result[0].code 
            ? (result[0].code as any)?.resp || JSON.stringify(result[0].code)
            : result[0].code?.toString() || '';
        
        // Generate filename
        const timestamp = new Date().toISOString().slice(0, 10);
        let filename = `wireframe-${uid.slice(0, 8)}-${timestamp}`;
        let contentType = 'text/plain';

        switch (format.toLowerCase()) {
            case 'jsx':
                filename += '.jsx';
                contentType = 'text/jsx';
                break;
            case 'tsx':
                filename += '.tsx';
                contentType = 'text/typescript';
                break;
            case 'zip':
                // For future implementation - create a full project zip
                filename += '.zip';
                contentType = 'application/zip';
                break;
            default:
                filename += '.jsx';
                contentType = 'text/jsx';
        }

        return new NextResponse(codeContent, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        return handleApiError(error);
    }
}
