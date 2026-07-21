import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_BYTES = 5 * 1024 * 1024;

export async function saveUploadedFile(
  file: File,
  folder: string,
): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only PDF, JPG, PNG, or WEBP files are allowed");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Each file must be 5MB or smaller");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const filename = `${folder}/${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, bytes, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "File uploads require BLOB_READ_WRITE_TOKEN on Vercel. Add Vercel Blob storage to your project.",
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  const localName = `${randomUUID()}.${extension}`;
  await writeFile(path.join(uploadDir, localName), bytes);
  return `/uploads/${folder}/${localName}`;
}
