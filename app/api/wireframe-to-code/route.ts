import { db } from "@/configs/db";
import { usersTable, WireframeToCodeTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { AppError, handleApiError, validateRequest, rateLimitCheck } from "@/lib/error-handling";

export async function POST(req: NextRequest) {
    try {
        // Rate limiting check
        rateLimitCheck(req, 'wireframe-creation');

        const { description, imageUrl, model, uid, email } = await req.json();
        
        // Validate required fields
        validateRequest({ description, imageUrl, model, uid, email }, 
            ['description', 'imageUrl', 'model', 'uid', 'email']);

        console.log('Creating wireframe for user:', email);

        const creditResult = await db.select().from(usersTable)
            .where(eq(usersTable.email, email));

        if (!creditResult[0]) {
            throw new AppError('User not found', 404);
        }

        if (!creditResult[0]?.credits || creditResult[0]?.credits <= 0) {
            throw new AppError('Insufficient credits. Please purchase more credits to continue.', 402);
        }

        // Insert wireframe record
        const result = await db.insert(WireframeToCodeTable).values({
            uid: uid.toString(),
            description: description,
            imageUrl: imageUrl,
            model: model,
            createdBy: email
        }).returning({ id: WireframeToCodeTable.id, uid: WireframeToCodeTable.uid });

        // Update user credits
        await db.update(usersTable).set({
            credits: creditResult[0]?.credits - 1
        }).where(eq(usersTable.email, email));

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
        const reqUrl = req.url;
        const { searchParams } = new URL(reqUrl);
        const uid = searchParams?.get('uid');
        const email = searchParams?.get('email');
        
        if (uid) {
            const result = await db.select()
                .from(WireframeToCodeTable)
                .where(eq(WireframeToCodeTable.uid, uid));
            
            if (!result[0]) {
                throw new AppError('Wireframe not found', 404);
            }
            
            return NextResponse.json({
                success: true,
                data: result[0]
            });
        }
        else if (email) {
            const result = await db.select()
                .from(WireframeToCodeTable)
                .where(eq(WireframeToCodeTable.createdBy, email))
                .orderBy(desc(WireframeToCodeTable.id));
            
            return NextResponse.json({
                success: true,
                data: result,
                count: result.length
            });
        }

        throw new AppError('Missing required parameter: uid or email', 400);

    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { uid, codeResp } = await req.json();
        
        validateRequest({ uid, codeResp }, ['uid', 'codeResp']);

        const result = await db.update(WireframeToCodeTable)
            .set({
                code: codeResp
            }).where(eq(WireframeToCodeTable.uid, uid))
            .returning({ uid: WireframeToCodeTable.uid });

        if (!result[0]) {
            throw new AppError('Wireframe not found', 404);
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