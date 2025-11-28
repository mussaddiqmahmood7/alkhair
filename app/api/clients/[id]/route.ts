import { NextResponse } from "next/server"
import { getClientById, updateClient, deleteClient } from "@/lib/clients"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = await getClientById(id)
    
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...clientWithoutPassword } = client
    return NextResponse.json({ client: clientWithoutPassword })
  } catch (error) {
    console.error("Failed to get client:", error)
    return NextResponse.json({ error: "Failed to get client" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_token")

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const updates = await request.json()
    
    const client = await updateClient(id, updates)

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...clientWithoutPassword } = client
    return NextResponse.json({ client: clientWithoutPassword })
  } catch (error) {
    console.error("Failed to update client:", error)
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_token")

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const success = await deleteClient(id)

    if (success) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  } catch (error) {
    console.error("Failed to delete client:", error)
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
