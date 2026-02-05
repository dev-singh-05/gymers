// Cloudinary upload utility
// Uses unsigned upload for client-side uploads

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
const FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || '';

export interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
}

export async function uploadImage(file: File): Promise<CloudinaryResponse> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error('Cloudinary configuration missing. Check your .env.local file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    if (FOLDER) {
        formData.append('folder', FOLDER);
    }

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );

    const result = await response.json();

    if (!response.ok) {
        // Show the actual Cloudinary error
        const errorMsg = result?.error?.message || 'Failed to upload image';
        console.error('Cloudinary error:', errorMsg);
        throw new Error(errorMsg);
    }

    return result;
}

// Generate optimized thumbnail URL
export function getOptimizedUrl(publicId: string, width = 200): string {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},h_${width},c_fill,g_face,q_auto,f_auto/${publicId}`;
}
