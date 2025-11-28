import { NextResponse } from "next/server"
import { authenticateClient } from "@/lib/clients"

export async function POST(request: Request) {
  try {
    const { clientId, password } = await request.json()
    const client = authenticateClient(clientId, password)

    if (client) {
      return NextResponse.json({ success: true, client })
    }
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
