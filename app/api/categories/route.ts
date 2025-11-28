import { NextResponse } from "next/server"
import { getCategories, addCategory, deleteCategory, getDefaultCategory } from "@/lib/categories"
import { moveProductsToCategory } from "@/lib/products"

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Failed to get categories:", error)
    return NextResponse.json({ error: "Failed to get categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }
    const category = await addCategory(name)
    return NextResponse.json({ category })
  } catch (error) {
    console.error("Failed to add category:", error)
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id, categoryName } = await request.json()
    const defaultCategory = await getDefaultCategory()

    // Move products to default category before deleting
    const movedCount = await moveProductsToCategory(categoryName, defaultCategory.name)

    const result = await deleteCategory(id)
    if (result.success) {
      return NextResponse.json({ success: true, movedProducts: movedCount })
    }
    return NextResponse.json({ error: "Cannot delete this category" }, { status: 400 })
  } catch (error) {
    console.error("Failed to delete category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
