import { NextResponse } from "next/server"
import { updateClient, deleteClient } from "@/lib/clients"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const updates = await request.json()
    const client = updateClient(id, updates)
    if (client) {
      return NextResponse.json({ client })
    }
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  } catch {
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const success = deleteClient(id)
    if (success) {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  } catch {
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
