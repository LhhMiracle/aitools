import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Convert a local file path or URL to a data URI that Replicate can use
 */
export async function fileToDataUri(filePath: string): Promise<string> {
  try {
    // If it's already a data URI, return as is
    if (filePath.startsWith('data:')) {
      return filePath;
    }

    // If it's a public URL (http/https), return as is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    // If it's a local path starting with /uploads/
    if (filePath.startsWith('/uploads/')) {
      const fullPath = join(process.cwd(), 'public', filePath);
      const fileBuffer = await readFile(fullPath);
      const base64 = fileBuffer.toString('base64');

      // Determine MIME type from file extension
      let mimeType = 'image/jpeg';
      if (filePath.endsWith('.png')) {
        mimeType = 'image/png';
      } else if (filePath.endsWith('.webp')) {
        mimeType = 'image/webp';
      } else if (filePath.endsWith('.gif')) {
        mimeType = 'image/gif';
      }

      return `data:${mimeType};base64,${base64}`;
    }

    throw new Error('Unsupported file path format');
  } catch (error) {
    console.error('Error converting file to data URI:', error);
    throw error;
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 10MB.',
    };
  }

  return { valid: true };
}
