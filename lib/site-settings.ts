import { put, list } from "@vercel/blob";

export interface StatusMessages {
  proceedTitle: string
  proceedMessage: string
  noBalanceTitle: string
  noBalanceMessage: string
  pendingTitle: string
  pendingMessage: string
}

export interface SiteSettings {
  businessName: string
  tagline: string
  phone: string
  email: string
  address: string
  addressLine2: string
  businessHours: string[]
  heroImage: string
  ownerName: string
  ownerTitle: string
  ownerImage: string
  ownerBio: string
  trustedSince: string
  yearsExperience: string
  happyCustomers: string
  totalProducts: string
  citiesServed: string
  statusMessages: StatusMessages
}

const SETTINGS_BLOB_PATH = "settings/site-settings.json";

const defaultSettings: SiteSettings = {
  businessName: "Al-Khair Traders",
  tagline: "Your Trusted Electrical Solutions Partner",
  phone: "03009884810",
  email: "alkhairtraders@gmail.com",
  address: "GT Road, Okara",
  addressLine2: "Punjab, Pakistan",
  businessHours: ["Mon - Sat: 9AM - 9PM", "Sunday: 10AM - 6PM"],
  heroImage: "/electrical-distribution-board-panel-professional-c.jpg",
  ownerName: "Haji Khalid Mehmood",
  ownerTitle: "Founder & Business Owner",
  ownerImage: "/owner.png",
  ownerBio:
    "With over 40 years of experience in the electrical industry, Haji Khalid Mehmood established Al-Khair Traders in 1985. His dedication to quality products and customer satisfaction has made us the most trusted name in electrical supplies across the Okara region. Under his visionary leadership, the business has grown from a small shop to a well-known supplier serving thousands of customers.",
  trustedSince: "1985",
  yearsExperience: "40+",
  happyCustomers: "10,000+",
  totalProducts: "500+",
  citiesServed: "100+",
  statusMessages: {
    proceedTitle: "Ready to Order",
    proceedMessage:
      "Your account is in good standing. You can proceed with new orders. Contact us to place your order!",
    noBalanceTitle: "Balance Required",
    noBalanceMessage:
      "Your credit balance is too low. Please clear your pending dues to continue ordering. Contact us for payment details.",
    pendingTitle: "Order Available Soon",
    pendingMessage: "Your order will be available in 3-4 days. Please wait or contact us for more information.",
  },
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const BLOB_TOKEN = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;
    
    if (!BLOB_TOKEN) {
      throw new Error("BLOB_TOKEN not found");
    }

    // Try to get settings from blob storage by listing blobs with the prefix
    const { blobs } = await list({
      prefix: "settings/",
      token: BLOB_TOKEN,
    });

    if (blobs && blobs.length > 0) {
      // Find the exact match for our settings file
      const settingsBlob = blobs.find(blob => blob.pathname === SETTINGS_BLOB_PATH) || blobs[0];
      
      // Fetch the content from the blob URL
      const response = await fetch(settingsBlob.url);
      if (response.ok) {
        const text = await response.text();
        const settings = JSON.parse(text) as SiteSettings;
        return settings;
      }
    }

    // If no data exists in blob storage, seed default data and return it
    console.log("No settings found in blob storage, seeding default data...");
    const settingsJson = JSON.stringify(defaultSettings, null, 2);
    
    try {
      await put(SETTINGS_BLOB_PATH, settingsJson, {
        access: "public",
        token: BLOB_TOKEN,
        contentType: "application/json",
        allowOverwrite: false, // Only create if it doesn't exist
      });
      // Successfully seeded, return default settings
      return defaultSettings;
    } catch (putError) {
      // If put fails because file exists (race condition), fetch it
      if (putError instanceof Error && putError.message.includes("already exists")) {
        console.log("Settings file was created by another request, fetching...");
        const { blobs } = await list({
          prefix: "settings/",
          token: BLOB_TOKEN,
        });
        if (blobs && blobs.length > 0) {
          const settingsBlob = blobs.find(blob => blob.pathname === SETTINGS_BLOB_PATH) || blobs[0];
          const response = await fetch(settingsBlob.url);
          if (response.ok) {
            const text = await response.text();
            return JSON.parse(text) as SiteSettings;
          }
        }
      }
      throw putError;
    }
  } catch (error) {
    console.error("Failed to load or seed settings from blob storage:", error);
    throw error;
  }
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  try {
    const BLOB_TOKEN = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;
    
    if (!BLOB_TOKEN) {
      throw new Error("BLOB_TOKEN not found");
    }

    // Get current settings (will seed defaults if not exists)
    const currentSettings = await getSiteSettings();

    // Merge updates with current settings
    const updatedSettings: SiteSettings = { ...currentSettings, ...updates };

    // Convert to JSON string
    const settingsJson = JSON.stringify(updatedSettings, null, 2);

    // Upload to blob storage (overwrites existing file at same path)
    await put(SETTINGS_BLOB_PATH, settingsJson, {
      access: "public",
      token: BLOB_TOKEN,
      contentType: "application/json",
      allowOverwrite: true,
    });

    return updatedSettings;
  } catch (error) {
    console.error("Failed to update settings in blob storage:", error);
    throw error;
  }
}

/**
 * Export settings as JSON string for backup purposes
 * Use this to create backups of your settings
 */
export async function exportSiteSettings(): Promise<string> {
  const settings = await getSiteSettings();
  return JSON.stringify(settings, null, 2);
}
