import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const UPLOAD_CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  ico: "image/x-icon",
  mp4: "video/mp4",
  webm: "video/webm",
};

// Hostinger deploys every build into a fresh hbuilds/versions/<id> folder, so
// files written under the build's public/ disappear on the next deploy. Set
// UPLOAD_DIR to a folder outside the build in production; it is served by
// src/app/uploads/[...path]/route.ts.
export function getUploadDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
}

export async function uploadImage(file: File): Promise<string> {
  try {
    const originalName = file.name || "image.jpg";
    const ext = (originalName.split(".").pop() || "jpg").toLowerCase();
    if (!UPLOAD_CONTENT_TYPES[ext]) {
      throw new Error(`Unsupported file type: .${ext}`);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the uploads directory exists
    const uploadDir = getUploadDir();
    await mkdir(uploadDir, { recursive: true });

    // Generate a unique filename to prevent overwriting
    const uniqueFilename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
    const filepath = path.join(uploadDir, uniqueFilename);

    // Save the file locally
    await writeFile(filepath, buffer);

    // Return the public URL path
    return `/uploads/${uniqueFilename}`;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Failed to upload image");
  }
}
