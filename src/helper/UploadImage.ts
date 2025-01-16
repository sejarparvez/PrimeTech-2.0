import cloudinary from "@/utils/cloudinary";
import { Readable } from "stream";

// Function to upload image to Cloudinary and return URL and public_id
export async function UploadImage(
  image: Blob,
  folder: string,
): Promise<{ secure_url: string; public_id: string }> {
  const filename = `${Date.now()}_${(image as File).name.replaceAll(" ", "_")}`;
  const buffer = Buffer.from(await image.arrayBuffer());

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, public_id: filename },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              secure_url: result?.secure_url || "",
              public_id: result?.public_id || "",
            });
          }
        },
      );

      // Convert the buffer to a readable stream and pipe it into the Cloudinary upload stream
      Readable.from(buffer).pipe(uploadStream);
    },
  );

  return result; // Returns both secure_url and public_id
}
