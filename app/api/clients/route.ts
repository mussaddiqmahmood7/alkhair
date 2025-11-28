import { NextResponse } from "next/server"
import { getClients, addClient } from "@/lib/clients"

export async function GET() {
  const clients = getClients()
  return NextResponse.json({ clients })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const client = addClient(data)
    return NextResponse.json({ client })
  } catch {
    return NextResponse.json({ error: "Failed to add client" }, { status: 500 })
  }
}
