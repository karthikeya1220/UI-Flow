import { supabase } from '@/configs/supabaseConfig';

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param fileName - The name for the file (optional, will generate if not provided)
 * @param bucketName - The storage bucket name (default: 'wireframes')
 * @returns Promise with the public URL or error
 */
export async function uploadFileToSupabase(
    file: File, 
    fileName?: string,
    bucketName: string = 'wireframes'
): Promise<{ url?: string; error?: string }> {
    try {
        // Generate filename if not provided
        const finalFileName = fileName || `${Date.now()}-${file.name}`;
        
        // Upload file to Supabase Storage
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

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(data.path);

        if (urlData?.publicUrl) {
            console.log("File uploaded to Supabase Storage:", urlData.publicUrl);
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
 * @param filePath - The path to the file in storage
 * @param bucketName - The storage bucket name (default: 'wireframes')
 * @returns Promise with success status
 */
export async function deleteFileFromSupabase(
    filePath: string,
    bucketName: string = 'wireframes'
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

        if (error) {
            console.error('Supabase Storage delete error:', error);
            return { success: false, error: error.message };
        }

        console.log("File deleted from Supabase Storage:", filePath);
        return { success: true };
    } catch (error) {
        console.error('Unexpected error during file deletion:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        };
    }
}

/**
 * List files in a Supabase Storage bucket
 * @param folderPath - The folder path to list (default: 'Wireframe_To_Code')
 * @param bucketName - The storage bucket name (default: 'wireframes')
 * @returns Promise with list of files
 */
export async function listFilesInSupabase(
    folderPath: string = 'Wireframe_To_Code',
    bucketName: string = 'wireframes'
) {
    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .list(folderPath);

        if (error) {
            console.error('Supabase Storage list error:', error);
            return { files: [], error: error.message };
        }

        return { files: data || [], error: null };
    } catch (error) {
        console.error('Unexpected error during file listing:', error);
        return { 
            files: [], 
            error: error instanceof Error ? error.message : 'Unknown error' 
        };
    }
}
