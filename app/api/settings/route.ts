import { NextResponse } from "next/server"
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings"

export async function GET() {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Failed to get settings:", error)
    return NextResponse.json({ error: "Failed to get settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const updates = await request.json()
    const settings = await updateSiteSettings(updates)
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Failed to update settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
