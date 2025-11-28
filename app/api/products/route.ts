import { NextResponse } from "next/server"
import { getProducts, addProduct } from "@/lib/products"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Failed to get products:", error)
    return NextResponse.json({ error: "Failed to get products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("admin_token")

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, imageUrl, category } = body

    if (!name || !imageUrl || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await addProduct({ name, imageUrl, category })
    return NextResponse.json({ product })
  } catch (error) {
    console.error("Failed to add product:", error)
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
  }
}
