import { NextResponse } from "next/server"
import { authenticateClient } from "@/lib/clients"

export async function POST(request: Request) {
  try {
    const { clientId, password } = await request.json()
    const client = await authenticateClient(clientId, password)

    if (client) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...clientWithoutPassword } = client
      return NextResponse.json({ success: true, client: clientWithoutPassword })
    }
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Authentication failed:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
