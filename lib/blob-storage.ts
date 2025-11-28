import { put, list, del } from "@vercel/blob";

const BLOB_TOKEN = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Generic function to read JSON data from Vercel Blob storage
 */
export async function readBlobData<T>(path: string, defaultValue: T): Promise<T> {
  try {
    if (!BLOB_TOKEN) {
      throw new Error("BLOB_TOKEN not found");
    }

    // List blobs with the prefix to find the file
    const { blobs } = await list({
      prefix: path,
      token: BLOB_TOKEN,
    });

    if (blobs && blobs.length > 0) {
      // Find exact match or use first blob
      const blob = blobs.find((b) => b.pathname === path) || blobs[0];
      
      // Fetch the content
      const response = await fetch(blob.url);
      if (response.ok) {
        const text = await response.text();
        return JSON.parse(text) as T;
      }
    }
  } catch (error) {
    console.warn(`Failed to load data from blob storage (${path}):`, error);
    throw error;
  }

  // If no data found, return undefined to indicate seeding needed
  throw new Error(`No data found at ${path}`);
}

/**
 * Seed data to blob storage if it doesn't exist
 */
export async function seedBlobData<T>(path: string, defaultData: T): Promise<T> {
  try {
    if (!BLOB_TOKEN) {
      throw new Error("BLOB_TOKEN not found");
    }

    const jsonString = JSON.stringify(defaultData, null, 2);
    
    try {
      await put(path, jsonString, {
        access: "public",
        token: BLOB_TOKEN,
        contentType: "application/json",
        allowOverwrite: false, // Only create if it doesn't exist
      });
      console.log(`Seeded default data to ${path}`);
      return defaultData;
    } catch (putError) {
      // If put fails because file exists (race condition), fetch it
      if (putError instanceof Error && putError.message.includes("already exists")) {
        console.log(`Data at ${path} was created by another request, fetching...`);
        const { blobs } = await list({
          prefix: path,
          token: BLOB_TOKEN,
        });
        if (blobs && blobs.length > 0) {
          const blob = blobs.find((b) => b.pathname === path) || blobs[0];
          const response = await fetch(blob.url);
          if (response.ok) {
            const text = await response.text();
            return JSON.parse(text) as T;
          }
        }
      }
      throw putError;
    }
  } catch (error) {
    console.error(`Failed to seed data to blob storage (${path}):`, error);
    throw error;
  }
}

/**
 * Generic function to write JSON data to Vercel Blob storage
 */
export async function writeBlobData<T>(path: string, data: T): Promise<void> {
  try {
    if (!BLOB_TOKEN) {
      throw new Error("BLOB_TOKEN not found");
    }

    const jsonString = JSON.stringify(data, null, 2);

    await put(path, jsonString, {
      access: "public",
      token: BLOB_TOKEN,
      contentType: "application/json",
      allowOverwrite: true,
    });
  } catch (error) {
    console.error(`Failed to write data to blob storage (${path}):`, error);
    throw error;
  }
}

/**
 * Delete a blob from storage
 */
export async function deleteBlob(url: string): Promise<void> {
  try {
    if (!BLOB_TOKEN) {
      throw new Error("BLOB_TOKEN not found");
    }

    if (url && url.includes("blob.vercel-storage.com")) {
      await del(url, { token: BLOB_TOKEN });
    }
  } catch (error) {
    console.error(`Failed to delete blob (${url}):`, error);
    throw error;
  }
}

/**
 * Check if blob token is available
 */
export function hasBlobToken(): boolean {
  return !!BLOB_TOKEN;
}

