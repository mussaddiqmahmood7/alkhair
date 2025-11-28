export interface Category {
  id: string
  name: string
  isDefault: boolean
  createdAt: string
}

const categories: Category[] = [
  { id: "default", name: "General", isDefault: true, createdAt: new Date().toISOString() },
  { id: "1", name: "China Board 8+2", isDefault: false, createdAt: new Date().toISOString() },
  { id: "2", name: "China Board 6+2", isDefault: false, createdAt: new Date().toISOString() },
  { id: "3", name: "China Board 4+2", isDefault: false, createdAt: new Date().toISOString() },
  { id: "4", name: "China Board 2+2", isDefault: false, createdAt: new Date().toISOString() },
  { id: "5", name: "Light Plug", isDefault: false, createdAt: new Date().toISOString() },
  { id: "6", name: "5 in 1", isDefault: false, createdAt: new Date().toISOString() },
  { id: "7", name: "Power Plug", isDefault: false, createdAt: new Date().toISOString() },
  { id: "8", name: "Power Switch", isDefault: false, createdAt: new Date().toISOString() },
  { id: "9", name: "TV", isDefault: false, createdAt: new Date().toISOString() },
  { id: "10", name: "TW", isDefault: false, createdAt: new Date().toISOString() },
  { id: "11", name: "Bell Push", isDefault: false, createdAt: new Date().toISOString() },
  { id: "12", name: "Dimmer", isDefault: false, createdAt: new Date().toISOString() },
]

export function getCategories(): Category[] {
  return categories
}

export function getCategoryNames(): string[] {
  return categories.map((c) => c.name)
}

export function addCategory(name: string): Category {
  const newCategory: Category = {
    id: Date.now().toString(),
    name,
    isDefault: false,
    createdAt: new Date().toISOString(),
  }
  categories.push(newCategory)
  return newCategory
}

export function deleteCategory(id: string): { success: boolean; movedProducts: number } {
  const category = categories.find((c) => c.id === id)
  if (!category || category.isDefault) {
    return { success: false, movedProducts: 0 }
  }

  const index = categories.findIndex((c) => c.id === id)
  if (index !== -1) {
    categories.splice(index, 1)
    return { success: true, movedProducts: 0 }
  }
  return { success: false, movedProducts: 0 }
}

export function getDefaultCategory(): Category {
  return categories.find((c) => c.isDefault) || categories[0]
}
