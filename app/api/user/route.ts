import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/error-handling";
import { requireAuthUser } from "@/lib/auth";

export async function POST(_req: NextRequest) {
    try {
        // Authenticate via Supabase session cookie and retrieve/bind DB user
        const { dbUser, supabaseUser } = await requireAuthUser();

        return NextResponse.json({
            success: true,
            data: {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                credits: dbUser.credits,
                supabase_id: dbUser.supabase_id,
                avatar_url: supabaseUser.user_metadata?.avatar_url || null
            },
            message: 'User session verified'
        });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function GET(_req: Request) {
    try {
        const { dbUser, supabaseUser } = await requireAuthUser();

        return NextResponse.json({
            success: true,
            data: {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                credits: dbUser.credits,
                supabase_id: dbUser.supabase_id,
                avatar_url: supabaseUser.user_metadata?.avatar_url || null
            }
        });
    } catch (error) {
        return handleApiError(error);
    }
}
