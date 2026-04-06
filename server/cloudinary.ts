import { v2 as cloudinary } from "cloudinary";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Configure Cloudinary (unsigned upload from server side)
if (cloudName) {
  cloudinary.config({
    cloud_name: cloudName,
  });
}

interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string = "gemessence"
): Promise<UploadResult> {
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        upload_preset: uploadPreset,
        resource_type: "image",
        transformation: [
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(new Error(error.message));
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error("Upload failed with no result"));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!cloudName) return;

  await cloudinary.uploader.destroy(publicId);
}
