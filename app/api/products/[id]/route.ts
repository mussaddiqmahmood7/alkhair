import { NextResponse } from "next/server"
import { deleteProduct, updateProduct, getProducts } from "@/lib/products"
import { deleteBlob } from "@/lib/blob-storage"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const products = await getProducts()
    const product = products.find((p) => p.id === id)
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    
    return NextResponse.json({ product })
  } catch (error) {
    console.error("Failed to get product:", error)
    return NextResponse.json({ error: "Failed to get product" }, { status: 500 })
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
    const { imageUrl: oldImageUrl, ...restUpdates } = updates

    // If image is being updated and old image is a blob URL, delete it
    if (updates.imageUrl && oldImageUrl && oldImageUrl.includes("blob.vercel-storage.com") && oldImageUrl !== updates.imageUrl) {
      try {
        await deleteBlob(oldImageUrl)
      } catch (error) {
        console.error("Failed to delete old blob:", error)
      }
    }

    const product = await updateProduct(id, restUpdates)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Failed to update product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
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
    const body = await request.json().catch(() => ({}))
    const { imageUrl } = body

    // Delete from Blob storage if it's a blob URL
    if (imageUrl && imageUrl.includes("blob.vercel-storage.com")) {
      try {
        await deleteBlob(imageUrl)
      } catch (error) {
        console.error("Failed to delete blob:", error)
      }
    }

    const success = await deleteProduct(id)

    if (success) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
