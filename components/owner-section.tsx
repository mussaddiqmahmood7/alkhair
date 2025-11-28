"use client"

import { useEffect, useState } from "react"
import { Quote } from "lucide-react"
import type { SiteSettings } from "@/lib/site-settings"

export function OwnerSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch(() => {})
  }, [])

  return (
    <section id="owner" className="py-16 md:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
            Meet Our <span className="text-primary">Founder</span>
          </h2>
          <p className="text-secondary-foreground/80 max-w-2xl mx-auto text-pretty">
            The visionary behind {settings?.businessName || "Khalid Electric Store"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 p-2">
                <div className="w-full h-full rounded-full overflow-hidden bg-muted">
                  <img
                    src={settings?.ownerImage || "/owner.png"}
                    alt={settings?.ownerName || "Haji Khalid Mehmood"}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold text-sm whitespace-nowrap">
                Since {settings?.trustedSince || "1985"}
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-6">
              <Quote className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-secondary-foreground mb-2">
              {settings?.ownerName || "Haji Khalid Mehmood"}
            </h3>
            <p className="text-primary font-medium mb-6">{settings?.ownerTitle || "Founder & Business Owner"}</p>
            <p className="text-secondary-foreground/80 leading-relaxed text-pretty">
              {settings?.ownerBio ||
                "With over 40 years of experience in the electrical industry, Haji Khalid Mehmood established Khalid Electric Store in 1985. His dedication to quality products and customer satisfaction has made us the most trusted name in electrical supplies across the Okara region. Under his visionary leadership, the business has grown from a small shop to a well-known supplier serving thousands of customers."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="bg-card px-6 py-3 rounded-xl border border-border">
                <p className="text-2xl font-bold text-primary">{settings?.yearsExperience || "40+"}</p>
                <p className="text-sm text-muted-foreground">Years of Service</p>
              </div>
              <div className="bg-card px-6 py-3 rounded-xl border border-border">
                <p className="text-2xl font-bold text-primary">{settings?.happyCustomers || "10,000+"}</p>
                <p className="text-sm text-muted-foreground">Satisfied Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
