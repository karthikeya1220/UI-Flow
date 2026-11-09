import { db } from "@/configs/db";
import { WireframeToCodeTable } from "@/configs/schema";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { AppError, handleApiError, validateRequest, rateLimitCheck } from "@/lib/error-handling";
import { requireAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        rateLimitCheck(req, 'wireframe-creation');

        // Authenticate user securely
        const { dbUser } = await requireAuthUser();

        const { description, imageUrl, model, uid } = await req.json();
        
        validateRequest({ description, imageUrl, model, uid }, 
            ['description', 'imageUrl', 'model', 'uid']);

        // Insert wireframe record bound to dbUser.id and dbUser.email
        const result = await db.insert(WireframeToCodeTable).values({
            uid: uid.toString(),
            description: description,
            imageUrl: imageUrl,
            model: model,
            createdBy: dbUser.email,
            user_id: dbUser.id
        }).returning({
            id: WireframeToCodeTable.id,
            uid: WireframeToCodeTable.uid,
            user_id: WireframeToCodeTable.user_id
        });

        return NextResponse.json({
            success: true,
            data: result[0],
            message: 'Wireframe created successfully'
        });

    } catch (error) {
        return handleApiError(error);
    }
}

export async function GET(req: Request) {
    try {
        const { dbUser } = await requireAuthUser();

        const reqUrl = req.url;
        const { searchParams } = new URL(reqUrl);
        const uid = searchParams?.get('uid');
        
        if (uid) {
            // Enforce ownership: record must belong to dbUser.id
            const result = await db.select()
                .from(WireframeToCodeTable)
                .where(
                    and(
                        eq(WireframeToCodeTable.uid, uid),
                        eq(WireframeToCodeTable.user_id, dbUser.id)
                    )
                );
            
            if (!result[0]) {
                throw new AppError('Wireframe not found or access denied', 404);
            }
            
            return NextResponse.json({
                success: true,
                data: result[0]
            });
        } else {
            // Retrieve all projects owned by the authenticated user
            const result = await db.select()
                .from(WireframeToCodeTable)
                .where(eq(WireframeToCodeTable.user_id, dbUser.id))
                .orderBy(desc(WireframeToCodeTable.id));
            
            return NextResponse.json({
                success: true,
                data: result,
                count: result.length
            });
        }

    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { dbUser } = await requireAuthUser();

        const { uid, codeResp } = await req.json();
        
        if (!uid || uid.trim() === '') {
            throw new AppError('UID is required', 400);
        }
        
        if (!codeResp || (typeof codeResp === 'object' && (!codeResp.resp || codeResp.resp.trim() === '')) || (typeof codeResp === 'string' && codeResp.trim() === '')) {
            throw new AppError('Code response is required', 400);
        }

        // Enforce ownership during code update
        const result = await db.update(WireframeToCodeTable)
            .set({
                code: codeResp
            })
            .where(
                and(
                    eq(WireframeToCodeTable.uid, uid),
                    eq(WireframeToCodeTable.user_id, dbUser.id)
                )
            )
            .returning({ uid: WireframeToCodeTable.uid });

        if (!result[0]) {
            throw new AppError('Wireframe not found or access denied', 404);
        }

        return NextResponse.json({
            success: true,
            data: result[0],
            message: 'Code updated successfully'
        });

    } catch (error) {
        return handleApiError(error);
    }
}
