"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Shield, Award, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SiteSettings } from "@/lib/site-settings"
import Image from "next/image"

export function HeroSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch(() => {})
  }, [])

  const baseURL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL

  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Trusted Since {settings?.trustedSince || "1985"}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-6 text-balance">
              Quality <span className="text-primary">China Fitting Boards</span> & Electrical Supplies
            </h1>
            <p className="text-lg text-secondary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0 text-pretty">
              Your one-stop shop for premium China Boards, Light Plugs, Power Switches, Dimmers, and all electrical
              accessories. Serving {settings?.address || "Okara"} and surrounding areas with quality products for over{" "}
              {settings?.yearsExperience || "40+"} years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#products">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  View Products <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href={`tel:${settings?.phone || "03009884810"}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent text-secondary-foreground border-secondary-foreground/30 hover:bg-secondary-foreground/10"
                >
                  Call Now: {settings?.phone || "03009884810"}
                </Button>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-primary/30 to-primary/10 rounded-3xl p-8 flex items-center justify-center">
              <Image
                src={
                  baseURL  + (settings?.heroImage ?? '' )}
                  fill
                alt="Premium China Fitting Electrical Board"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-xl hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-card-foreground">{settings?.yearsExperience || "40+"} Years</p>
                  <p className="text-sm text-muted-foreground">Experience</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-xl hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-card-foreground">Fast Delivery</p>
                  <p className="text-sm text-muted-foreground">All Over Pakistan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
