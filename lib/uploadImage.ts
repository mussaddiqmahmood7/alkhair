import { put } from "@vercel/blob";
import { compressImage } from "./compressImage";

export async function uploadImage(file: File) {
  const compressedFile = await compressImage(file);

  const BLOB_TOKEN = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN; 
  const blob = await put(`products/${Date.now()}-${file.name}`, compressedFile, {
    access: "public",
    token:BLOB_TOKEN
  });

  return blob.url; 
}
