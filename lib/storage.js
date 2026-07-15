// lib/storage.js — subida de media a un bucket compatible con S3
// (Cloudflare R2, AWS S3, Supabase Storage, Backblaze B2...).
// Genera una URL firmada para que el navegador suba el archivo directo al bucket
// (así los videos no pasan por la función serverless, que tiene límite de tamaño).
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let client;
function s3() {
  if (!client) {
    client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT, // p.ej. https://<cuenta>.r2.cloudflarestorage.com
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }
  return client;
}

export function isConfigured() {
  return !!(process.env.S3_BUCKET && process.env.S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID);
}

// Devuelve { uploadUrl (PUT firmado), publicUrl (para pasar a Instagram) }
export async function createUploadUrl({ key, contentType }) {
  const cmd = new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(s3(), cmd, { expiresIn: 600 });
  const base = (process.env.S3_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const publicUrl = `${base}/${key}`;
  return { uploadUrl, publicUrl };
}
