import { getSupabaseClient } from '@/configs/supabaseConfig';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFileToSupabase(
    file: File,
    fileName?: string,
    bucketName: string = 'wireframes'
): Promise<{ url?: string; error?: string }> {
    try {
        const supabase = getSupabaseClient();
        const finalFileName = fileName || `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(`Wireframe_To_Code/${finalFileName}`, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase Storage upload error:', error);
            return { error: error.message };
        }

        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(data.path);

        if (urlData?.publicUrl) {
            return { url: urlData.publicUrl };
        } else {
            return { error: 'Failed to get public URL' };
        }
    } catch (error) {
        console.error('Unexpected error during file upload:', error);
        return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFileFromSupabase(
    filePath: string,
    bucketName: string = 'wireframes'
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * List files in a Supabase Storage bucket
 */
export async function listFilesInSupabase(
    folderPath: string = 'Wireframe_To_Code',
    bucketName: string = 'wireframes'
) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.storage
            .from(bucketName)
            .list(folderPath);

        if (error) {
            return { files: [], error: error.message };
        }

        return { files: data || [], error: null };
    } catch (error) {
        return {
            files: [],
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
