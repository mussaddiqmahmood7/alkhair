"use client"

import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { useSettings } from "@/lib/hooks/use-settings"

export function ContactSection() {
  const { data: settings } = useSettings()

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: [settings?.phone || "03009884810"],
    },
    {
      icon: Mail,
      title: "Email",
      details: [settings?.email || "khalidelectric@gmail.com"],
    },
    {
      icon: MapPin,
      title: "Address",
      details: [settings?.address || "GT Road, Okara", settings?.addressLine2 || "Punjab, Pakistan"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: settings?.businessHours || ["Mon - Sat: 9AM - 9PM", "Sunday: 10AM - 6PM"],
    },
  ]

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Have questions or need a quote? Contact us today and our team will assist you with your electrical needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info) => (
            <div key={info.title} className="bg-card p-6 rounded-xl border border-border text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2">{info.title}</h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-sm text-muted-foreground">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-secondary rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold text-secondary-foreground mb-4">Ready to Place an Order?</h3>
          <p className="text-secondary-foreground/80 mb-6 max-w-xl mx-auto">
            Call us now or visit our shop at {settings?.address || "GT Road, Okara"} to see our complete range of China
            Boards and electrical products.
          </p>
          <a
            href={`tel:${settings?.phone || "03009884810"}`}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Call Now: {settings?.phone || "03009884810"}
          </a>
        </div>
      </div>
    </section>
  )
}
