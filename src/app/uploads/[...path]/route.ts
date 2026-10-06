import { readFile } from "fs/promises";
import path from "path";
import { getUploadDir, UPLOAD_CONTENT_TYPES } from "@/lib/storage";

// Serves files uploaded at runtime. Files already in public/uploads at build
// time are served by Next directly and never reach this handler.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const name = segments.join("/");

  // Uploads are stored flat with generated names; reject anything else
  // (including traversal like ../) before touching the filesystem.
  if (segments.length !== 1 || !/^[\w-]+\.[a-z0-9]+$/i.test(name)) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = UPLOAD_CONTENT_TYPES[path.extname(name).slice(1).toLowerCase()];
  if (!contentType) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await readFile(path.join(getUploadDir(), name));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        // Neutralise scripts in uploaded SVGs opened directly.
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
