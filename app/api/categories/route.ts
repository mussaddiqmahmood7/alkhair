import { NextResponse } from "next/server"
import { getCategories, addCategory, deleteCategory, getDefaultCategory } from "@/lib/categories"
import { moveProductsToCategory } from "@/lib/products"

export async function GET() {
  const categories = getCategories()
  return NextResponse.json({ categories })
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    const category = addCategory(name)
    return NextResponse.json({ category })
  } catch {
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, categoryName } = await request.json()
    const defaultCategory = getDefaultCategory()

    // Move products to default category before deleting
    const movedCount = moveProductsToCategory(categoryName, defaultCategory.name)

    const result = deleteCategory(id)
    if (result.success) {
      return NextResponse.json({ success: true, movedProducts: movedCount })
    }
    return NextResponse.json({ error: "Cannot delete this category" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
