import imageCompression from "browser-image-compression";

export async function compressImage(file:File) {
  const options = {
    maxSizeMB: 2,               
    maxWidthOrHeight: 1000,     
    initialQuality: 0.8,        
    useWebWorker: true,
  };

  const compressed = await imageCompression(file, options);
  return compressed;
}
