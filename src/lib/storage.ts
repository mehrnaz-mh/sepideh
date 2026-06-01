import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { v2 as cloudinary } from "cloudinary";

export type UploadResult = {
  url: string;
  secureUrl: string;
  publicId: string;
  cloudinaryId: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
};

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
): Promise<UploadResult> {
  configureCloudinary();

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    format?: string;
    width?: number;
    height?: number;
    bytes?: number;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(uploadResult);
      },
    );
    stream.end(buffer);
  });

  return {
    url: result.secure_url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    cloudinaryId: result.public_id,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

async function uploadToLocal(
  buffer: Buffer,
  folder: string,
  mimeType: string,
): Promise<UploadResult> {
  const ext =
    mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
        ? "webp"
        : mimeType === "image/gif"
          ? "gif"
          : "jpg";
  const fileName = `${randomUUID()}.${ext}`;
  const relativeDir = path.join("uploads", folder);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  await mkdir(absoluteDir, { recursive: true });
  await writeFile(path.join(absoluteDir, fileName), buffer);

  const publicPath = `/${relativeDir.replace(/\\/g, "/")}/${fileName}`;
  return {
    url: publicPath,
    secureUrl: publicPath,
    publicId: publicPath,
    cloudinaryId: publicPath,
    format: ext,
    bytes: buffer.length,
  };
}

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function uploadImage(
  file: File,
  folder = "uploads",
): Promise<UploadResult> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Unsupported file type. Use JPEG, PNG, WebP, or GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File too large. Maximum size is 10 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "") || "uploads";

  if (isCloudinaryConfigured()) {
    return uploadToCloudinary(buffer, safeFolder);
  }

  return uploadToLocal(buffer, safeFolder, file.type);
}
