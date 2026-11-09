import axios from 'axios';

/**
 * Upload an image file through the secure server-side upload API.
 * Validates file size (max 5 MB), allowed MIME types (PNG, JPEG, WebP), and magic bytes,
 * then stores the image in the user's isolated folder in the private 'wireframes' bucket
 * and returns a temporary signed URL.
 */
export async function uploadFileToSupabase(
    file: File
): Promise<{ url?: string; filePath?: string; error?: string }> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/api/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data?.success && response.data?.data) {
            return {
                url: response.data.data.signedUrl,
                filePath: response.data.data.filePath,
            };
        }

        return { error: response.data?.message || 'Upload failed' };
    } catch (error: any) {
        console.error('File upload error:', error);
        const message = error.response?.data?.message || error.message || 'File upload failed';
        return { error: message };
    }
}

/**
 * Request a fresh signed URL for an existing file path in the private wireframes bucket.
 */
export async function getSignedUrlForPath(
    filePath: string
): Promise<{ signedUrl?: string; error?: string }> {
    try {
        const response = await axios.get(`/api/storage-signed-url?path=${encodeURIComponent(filePath)}`);
        if (response.data?.success && response.data?.data?.signedUrl) {
            return { signedUrl: response.data.data.signedUrl };
        }
        return { error: response.data?.message || 'Failed to retrieve signed URL' };
    } catch (error: any) {
        return { error: error.response?.data?.message || error.message || 'Failed to retrieve signed URL' };
    }
}
