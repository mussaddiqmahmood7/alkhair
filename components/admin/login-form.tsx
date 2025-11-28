"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Zap, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ADMIN_CREDENTIALS } from "@/lib/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push("/admin/dashboard")
        router.refresh()
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      console.log("err ",err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground">Admin Login</h1>
            <p className="text-muted-foreground mt-2">Sign in to manage your products</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={ADMIN_CREDENTIALS.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo Credentials:</strong>
              <br />
              Email: {ADMIN_CREDENTIALS.email}
              <br />
              {ADMIN_CREDENTIALS.hint}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  )
}
