import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Generate a unique filename using the current timestamp and sanitized original name.
 *
 * @param originalName - The original name of the file.
 * @returns A unique, sanitized filename.
 */
function generateFilename(originalName: string): string {
  const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now(); // Current timestamp in milliseconds
  return `${timestamp}_${sanitizedOriginalName}`;
}

/**
 * Uploads an image to Cloudinary.
 *
 * @param image - The image blob to be uploaded.
 * @param folder - The Cloudinary folder where the image will be stored.
 * @returns A Promise containing the secure URL and public ID of the uploaded image.
 */
export async function cloudinaryUploadImage(
  image: Blob,
  folder: string
): Promise<{ secure_url: string; public_id: string }> {
  const originalName = (image as File).name;
  const uniqueFilename = generateFilename(originalName);

  const buffer = Buffer.from(await image.arrayBuffer());

  // Wrap the Cloudinary upload stream in a Promise
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: uniqueFilename },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        } else {
          reject(new Error('Unknown error during Cloudinary upload.'));
        }
      }
    );

    // Pipe the buffer as a readable stream into the upload stream
    Readable.from(buffer).pipe(uploadStream);
  });
}

// Utility function to delete an image from Cloudinary by its public ID
export async function deleteImageFromCloudinary(
  imageId: string
): Promise<void> {
  try {
    // Call Cloudinary's API to delete the image by its public ID
    const result = await cloudinary.uploader.destroy(imageId);
    if (result.result === 'ok') {
      console.log(
        `Image with ID ${imageId} successfully deleted from Cloudinary.`
      );
    } else {
      console.log(`Failed to delete image with ID ${imageId}.`);
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Error deleting image from Cloudinary.');
  }
}
