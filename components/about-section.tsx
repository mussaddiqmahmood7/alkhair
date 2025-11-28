"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Users, Package, Clock } from "lucide-react"
import type { SiteSettings } from "@/lib/site-settings"

const features = [
  {
    icon: CheckCircle,
    title: "Premium Quality",
    description: "All our China Boards and electrical products meet safety standards and are tested for durability.",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Our experienced team provides technical guidance for all your electrical needs.",
  },
  {
    icon: Package,
    title: "Wide Range",
    description: "From China Boards to Dimmers, Light Plugs to Power Switches - we have it all.",
  },
  {
    icon: Clock,
    title: "Quick Service",
    description: "Fast and reliable service with delivery options across Pakistan.",
  },
]

export function AboutSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch(() => {})
  }, [])

  const stats = [
    { value: settings?.yearsExperience || "40+", label: "Years Experience" },
    { value: settings?.happyCustomers || "10,000+", label: "Happy Customers" },
    { value: settings?.totalProducts || "500+", label: "Products" },
    { value: settings?.citiesServed || "100+", label: "Cities Served" },
  ]

  return (
    <section id="about" className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">{settings?.businessName || "Khalid Electric"}?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Since {settings?.trustedSince || "1985"}, we have been committed to providing the highest quality China
            Fitting Boards and electrical supplies at competitive prices with exceptional customer service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-secondary-foreground/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
