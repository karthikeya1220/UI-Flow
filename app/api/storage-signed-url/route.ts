import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { handleApiError, AppError } from "@/lib/error-handling";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    try {
        const { supabaseUser } = await requireAuthUser();

        const { searchParams } = new URL(req.url);
        const path = searchParams.get('path');

        if (!path) {
            throw new AppError('Path parameter is required', 400);
        }

        // Verify folder prefix matches current authenticated user ID
        const folder = path.split('/')[0];
        if (folder !== supabaseUser.id) {
            throw new AppError('Access denied: Cannot generate signed URL for another user\'s file', 403);
        }

        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase.storage
            .from('wireframes')
            .createSignedUrl(path, 3600);

        if (error || !data?.signedUrl) {
            throw new AppError(error?.message || 'Failed to generate signed URL', 500);
        }

        return NextResponse.json({
            success: true,
            data: {
                signedUrl: data.signedUrl
            }
        });

    } catch (error) {
        return handleApiError(error);
    }
}

