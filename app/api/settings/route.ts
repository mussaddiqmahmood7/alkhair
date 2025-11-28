import { NextResponse } from "next/server"
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings"

export async function GET() {
  const settings = getSiteSettings()
  return NextResponse.json({ settings })
}

export async function POST(request: Request) {
  try {
    const updates = await request.json()
    const settings = updateSiteSettings(updates)
    return NextResponse.json({ settings })
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
