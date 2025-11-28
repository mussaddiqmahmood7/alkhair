"use client"

import type React from "react"

import { useState } from "react"
import { X, User, Lock, CheckCircle, XCircle, Clock, Phone, MapPin, Store, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Client } from "@/lib/clients"
import { useSettings } from "@/lib/hooks/use-settings"

export function ClientPortal() {
  const [isOpen, setIsOpen] = useState(false)
  const [clientId, setClientId] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [client, setClient] = useState<Client | null>(null)
  const { data: settings } = useSettings()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/clients/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, password }),
      })

      const data = await res.json()

      if (data.success) {
        setClient(data.client)
      } else {
        setError("Invalid Client ID or Password")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setClient(null)
    setClientId("")
    setPassword("")
    setError("")
  }

  const getStatusInfo = () => {
    if (!client || !settings) return null

    const { statusMessages } = settings

    switch (client.status) {
      case "proceed":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          title: statusMessages.proceedTitle,
          message: statusMessages.proceedMessage,
        }
      case "no-balance":
        return {
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          title: statusMessages.noBalanceTitle,
          message: statusMessages.noBalanceMessage,
        }
      case "pending":
        return {
          icon: Clock,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/30",
          title: statusMessages.pendingTitle,
          message: statusMessages.pendingMessage,
        }
      default:
        return null
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <>
      <section id="client-portal" className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Client <span className="text-primary">Portal</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              Existing clients can check their account status and order eligibility here.
            </p>
            <Button size="lg" onClick={() => setIsOpen(true)} className="gap-2">
              <User className="w-5 h-5" />
              Client Login
            </Button>
          </div>
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
              <h3 className="font-semibold text-card-foreground">{client ? "Account Status" : "Client Login"}</h3>
              <button onClick={handleClose} className="p-1 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {!client ? (
              <form onSubmit={handleLogin} className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Client ID
                  </Label>
                  <Input
                    id="clientId"
                    placeholder="Enter your Client ID"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Contact admin if you don&apos;t have login credentials
                </p>
              </form>
            ) : (
              <div className="p-6 space-y-4">
                <div className="text-center pb-4 border-b border-border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg text-card-foreground">{client.name}</h4>
                  <p className="text-sm text-muted-foreground">ID: {client.clientId}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Store className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Shop Name</p>
                      <p className="font-medium text-card-foreground">{client.shopName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-card-foreground">{client.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium text-card-foreground">{client.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="font-medium text-card-foreground">{client.description}</p>
                    </div>
                  </div>
                </div>

                {statusInfo && (
                  <div className={`mt-4 p-4 rounded-xl border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <statusInfo.icon className={`w-6 h-6 ${statusInfo.color}`} />
                      <h5 className={`font-semibold ${statusInfo.color}`}>{statusInfo.title}</h5>
                    </div>
                    <p className="text-sm text-card-foreground">{statusInfo.message}</p>
                  </div>
                )}

                <Button onClick={handleClose} variant="outline" className="w-full mt-4 bg-transparent">
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
