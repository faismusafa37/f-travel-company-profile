import fs from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

  const s3Endpoint = process.env.S3_ENDPOINT;
  const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID;
  const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const s3BucketName = process.env.S3_BUCKET_NAME;
  const s3PublicUrl = process.env.S3_PUBLIC_URL;
  const s3Region = process.env.S3_REGION || "auto";

  // Defensive check: if credentials are placeholder or empty, fallback to local file storage
  const isPlaceholder = 
    !s3AccessKeyId || 
    !s3SecretAccessKey || 
    s3AccessKeyId.includes("your_access_key") || 
    s3SecretAccessKey.includes("your_secret_access_key") ||
    !s3BucketName ||
    s3BucketName.includes("ftravel-uploads") ||
    !s3Endpoint ||
    s3Endpoint.includes("<ACCOUNT_ID>");

  if (isPlaceholder) {
    // Save locally
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const localPath = path.join(uploadDir, filename);
    await fs.writeFile(localPath, buffer);
    return `/uploads/${filename}`;
  }

  // Upload to S3 compatible storage
  try {
    const s3 = new S3Client({
      endpoint: s3Endpoint,
      region: s3Region,
      credentials: {
        accessKeyId: s3AccessKeyId!,
        secretAccessKey: s3SecretAccessKey!,
      },
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: s3BucketName,
        Key: filename,
        Body: buffer,
        ContentType: file.type || "image/jpeg",
      })
    );

    const publicBaseUrl = s3PublicUrl?.endsWith("/") ? s3PublicUrl : `${s3PublicUrl}/`;
    return `${publicBaseUrl}${filename}`;
  } catch (error) {
    console.error("S3 upload failed, falling back to local storage:", error);
    // Fallback local save
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const localPath = path.join(uploadDir, filename);
    await fs.writeFile(localPath, buffer);
    return `/uploads/${filename}`;
  }
}
