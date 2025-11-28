import { put } from "@vercel/blob";
import { compressImage } from "./compressImage";

export async function uploadImage(file: File) {
  const compressedFile = await compressImage(file);

  const blob = await put(`products/${Date.now()}-${file.name}`, compressedFile, {
    access: "public",
  });

  return blob.url; // final image URL
}
