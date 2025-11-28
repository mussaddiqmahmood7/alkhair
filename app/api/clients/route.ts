import { NextResponse } from "next/server"
import { getClients, addClient } from "@/lib/clients"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const clients = await getClients()
    // Don't send passwords in response
    const clientsWithoutPasswords = clients.map((client) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = client
      return rest
    })
    return NextResponse.json({ clients: clientsWithoutPasswords })
  } catch (error) {
    console.error("Failed to get clients:", error)
    return NextResponse.json({ error: "Failed to get clients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_token")

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const client = await addClient(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...clientWithoutPassword } = client
    return NextResponse.json({ client: clientWithoutPassword })
  } catch (error) {
    console.error("Failed to add client:", error)
    return NextResponse.json({ error: "Failed to add client" }, { status: 500 })
  }
}
