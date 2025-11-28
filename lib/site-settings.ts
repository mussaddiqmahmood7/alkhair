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

let siteSettings: SiteSettings = {
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

export function getSiteSettings(): SiteSettings {
  return siteSettings
}

export function updateSiteSettings(updates: Partial<SiteSettings>): SiteSettings {
  siteSettings = { ...siteSettings, ...updates }
  return siteSettings
}
