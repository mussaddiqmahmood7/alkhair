import imageCompression from "browser-image-compression";

export async function compressImage(file:File) {
  const options = {
    maxSizeMB: 3,               
    maxWidthOrHeight: 2000,     
    initialQuality: 0.9,        
    useWebWorker: true,
  };

  const compressed = await imageCompression(file, options);
  return compressed;
}
