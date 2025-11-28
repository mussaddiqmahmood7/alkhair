"use client"

import { useEffect, useState } from "react"
import { Zap } from "lucide-react"
import type { SiteSettings } from "@/lib/site-settings"

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch(() => {})
  }, [])

  return (
    <footer className="bg-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-secondary-foreground">
              {settings?.businessName || "Khalid Electric Store"}
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            <a
              href="#home"
              className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors text-sm"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors text-sm"
            >
              About
            </a>
            <a
              href="#products"
              className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors text-sm"
            >
              Products
            </a>
            <a
              href="#owner"
              className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors text-sm"
            >
              Our Story
            </a>
            <a
              href="#contact"
              className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors text-sm"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-foreground/10 text-center">
          <p className="text-secondary-foreground/60 text-sm">
            © {new Date().getFullYear()} {settings?.businessName || "Khalid Electric Store"}. All rights reserved. |
            Since {settings?.trustedSince || "1985"}
          </p>
        </div>
      </div>
    </footer>
  )
}
