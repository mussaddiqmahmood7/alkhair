import { readBlobData, writeBlobData, seedBlobData } from "./blob-storage";

export interface Category {
  id: string
  name: string
  isDefault: boolean
  createdAt: string
}

const CATEGORIES_BLOB_PATH = "data/categories.json";

const defaultCategories: Category[] = [
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

export async function getCategories(): Promise<Category[]> {
  try {
    // Try to get categories from blob storage
    const categories = await readBlobData<Category[]>(CATEGORIES_BLOB_PATH, []);
    return categories;
  } catch (error) {
    // If no data exists, seed default data to blob storage
    console.log("No categories found in blob storage, seeding default data...");
    return await seedBlobData(CATEGORIES_BLOB_PATH, defaultCategories);
  }
}

export async function getCategoryNames(): Promise<string[]> {
  const categories = await getCategories();
  return categories.map((c) => c.name);
}

export async function addCategory(name: string): Promise<Category> {
  const categories = await getCategories();
  const newCategory: Category = {
    id: Date.now().toString(),
    name,
    isDefault: false,
    createdAt: new Date().toISOString(),
  };
  categories.push(newCategory);
  await writeBlobData(CATEGORIES_BLOB_PATH, categories);
  return newCategory;
}

export async function deleteCategory(id: string): Promise<{ success: boolean; movedProducts: number }> {
  const categories = await getCategories();
  const category = categories.find((c) => c.id === id);
  if (!category || category.isDefault) {
    return { success: false, movedProducts: 0 };
  }

  const index = categories.findIndex((c) => c.id === id);
  if (index !== -1) {
    categories.splice(index, 1);
    await writeBlobData(CATEGORIES_BLOB_PATH, categories);
    return { success: true, movedProducts: 0 };
  }
  return { success: false, movedProducts: 0 };
}

export async function getDefaultCategory(): Promise<Category> {
  const categories = await getCategories();
  return categories.find((c) => c.isDefault) || categories[0];
}
