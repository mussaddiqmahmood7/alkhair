import { NextResponse } from "next/server"
import { deleteProduct } from "@/lib/products"
import { del } from "@vercel/blob"
import { cookies } from "next/headers"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_token")

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { imageUrl } = await request.json()

  // Delete from Blob storage if it's a blob URL
  if (imageUrl && imageUrl.includes("blob.vercel-storage.com")) {
    try {
      await del(imageUrl)
    } catch (error) {
      console.error("Failed to delete blob:", error)
    }
  }

  const success = deleteProduct(id)

  if (success) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Product not found" }, { status: 404 })
}
