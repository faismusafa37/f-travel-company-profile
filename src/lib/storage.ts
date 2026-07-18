import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function uploadImage(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate a unique filename to prevent overwriting
    const originalName = file.name || "image.jpg";
    const ext = originalName.split('.').pop() || 'jpg';
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
