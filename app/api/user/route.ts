
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { AppError, handleApiError, validateRequest } from "@/lib/error-handling";

export async function POST(req: NextRequest) {
    try {
        const { userEmail, userName } = await req.json();
        
        validateRequest({ userEmail, userName }, ['userEmail', 'userName']);
        
        console.log('Creating/finding user:', userEmail);

        const existingUser = await db.select().from(usersTable)
            .where(eq(usersTable.email, userEmail));

        if (existingUser?.length === 0) {
            const newUser = await db.insert(usersTable).values({
                name: userName,
                email: userEmail,
                credits: 3,
            }).returning({
                id: usersTable.id,
                name: usersTable.name,
                email: usersTable.email,
                credits: usersTable.credits
            });

            return NextResponse.json({
                success: true,
                data: newUser[0],
                message: 'User created successfully with 3 free credits'
            });
        }

        return NextResponse.json({
            success: true,
            data: existingUser[0],
            message: 'User found'
        });

    } catch (error) {
        return handleApiError(error);
    }
}

export async function GET(req: Request) {
    try {
        const reqUrl = req.url;
        const { searchParams } = new URL(reqUrl);
        const email = searchParams?.get('email');

        if (!email) {
            throw new AppError('Email parameter is required', 400);
        }

        const result = await db.select().from(usersTable)
            .where(eq(usersTable.email, email));

        if (!result[0]) {
            throw new AppError('User not found', 404);
        }

        return NextResponse.json({
            success: true,
            data: result[0]
        });

    } catch (error) {
        return handleApiError(error);
    }
}