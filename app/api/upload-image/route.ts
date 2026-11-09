import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth";
import { handleApiError, AppError } from "@/lib/error-handling";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MiB

function validateMagicBytes(buffer: Uint8Array, mimeType: string): boolean {
    if (buffer.length < 4) return false;

    if (mimeType === 'image/png') {
        // PNG header: 89 50 4E 47
        return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    }

    if (mimeType === 'image/jpeg') {
        // JPEG header: FF D8 FF
        return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    }

    if (mimeType === 'image/webp') {
        // RIFF header: 52 49 46 46 ... WEBP: 57 45 42 50
        if (buffer.length < 12) return false;
        const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
        const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
        return isRiff && isWebp;
    }

    return false;
}

export async function POST(req: NextRequest) {
    try {
        const { supabaseUser } = await requireAuthUser();

        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            throw new AppError('No file provided for upload', 400);
        }

        // 1. File size check (5 MiB limit)
        if (file.size > MAX_FILE_SIZE_BYTES) {
            throw new AppError('File size exceeds the 5 MB limit', 400);
        }

        // 2. MIME type validation against allowed list
        const clientMime = file.type?.toLowerCase();
        if (!ALLOWED_MIME_TYPES.has(clientMime)) {
            throw new AppError('Invalid image format. Allowed formats: PNG, JPEG, WebP', 400);
        }

        // 3. Server-side magic byte inspection
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        if (!validateMagicBytes(uint8Array, clientMime)) {
            throw new AppError('File content does not match reported image format', 400);
        }

        // 4. Construct isolated Storage path matching RLS: <supabase_user_id>/<timestamp>-<sanitized_filename>
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `${supabaseUser.id}/${Date.now()}-${sanitizedFilename}`;

        const supabase = await createServerSupabaseClient();
        const { error: uploadError } = await supabase.storage
            .from('wireframes')
            .upload(storagePath, arrayBuffer, {
                contentType: clientMime,
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase Storage upload error:', uploadError);
            throw new AppError(`Storage upload failed: ${uploadError.message}`, 500);
        }

        // 5. Generate signed URL with 1-hour expiration
        const { data: signedData, error: signError } = await supabase.storage
            .from('wireframes')
            .createSignedUrl(storagePath, 3600);

        if (signError || !signedData?.signedUrl) {
            console.error('Failed to create signed URL:', signError);
            throw new AppError('Failed to generate secure URL for uploaded image', 500);
        }

        return NextResponse.json({
            success: true,
            data: {
                filePath: storagePath,
                signedUrl: signedData.signedUrl
            },
            message: 'Image uploaded successfully'
        });

    } catch (error) {
        return handleApiError(error);
    }
}

