import { readBlobData, writeBlobData, seedBlobData } from "./blob-storage";

export interface Product {
  id: string
  name: string
  imageUrl: string
  category: string
  createdAt: string
}

const PRODUCTS_BLOB_PATH = "data/products.json";

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "China Board 8+2",
    imageUrl: "/electrical-china-fitting-board-8-2-way-distributio.jpg",
    category: "China Board 8+2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "China Board 6+2",
    imageUrl: "/electrical-china-fitting-board-6-2-way-panel-white.jpg",
    category: "China Board 6+2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "China Board 4+2",
    imageUrl: "/electrical-china-fitting-board-4-2-way-small-panel.jpg",
    category: "China Board 4+2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "China Board 2+2",
    imageUrl: "/electrical-china-fitting-board-2-2-way-compact-pan.jpg",
    category: "China Board 2+2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Premium Light Plug",
    imageUrl: "/electrical-light-plug-socket-white-modern-design.jpg",
    category: "Light Plug",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "5 in 1 Multi Socket",
    imageUrl: "/electrical-5-in-1-multi-socket-extension-board-whi.jpg",
    category: "5 in 1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Heavy Duty Power Plug",
    imageUrl: "/electrical-power-plug-3-pin-heavy-duty-white.jpg",
    category: "Power Plug",
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Modern Power Switch",
    imageUrl: "/electrical-power-switch-wall-mounted-white-modern.jpg",
    category: "Power Switch",
    createdAt: new Date().toISOString(),
  },
  {
    id: "9",
    name: "TV Socket Outlet",
    imageUrl: "/electrical-tv-antenna-socket-outlet-wall-plate-whi.jpg",
    category: "TV",
    createdAt: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Telephone Wall Socket",
    imageUrl: "/electrical-telephone-tw-wall-socket-outlet-white.jpg",
    category: "TW",
    createdAt: new Date().toISOString(),
  },
  {
    id: "11",
    name: "Bell Push Button",
    imageUrl: "/electrical-bell-push-button-doorbell-switch-white.jpg",
    category: "Bell Push",
    createdAt: new Date().toISOString(),
  },
  {
    id: "12",
    name: "Light Dimmer Switch",
    imageUrl: "/electrical-dimmer-switch-light-controller-white-mo.jpg",
    category: "Dimmer",
    createdAt: new Date().toISOString(),
  },
]

export async function getProducts(): Promise<Product[]> {
  try {
    // Try to get products from blob storage
    const products = await readBlobData<Product[]>(PRODUCTS_BLOB_PATH, []);
    return products;
  } catch (error) {
    // If no data exists, seed default data to blob storage
    console.log("No products found in blob storage, seeding default data...");
    return await seedBlobData(PRODUCTS_BLOB_PATH, defaultProducts);
  }
}

export async function addProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const products = await getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  products.unshift(newProduct);
  await writeBlobData(PRODUCTS_BLOB_PATH, products);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    await writeBlobData(PRODUCTS_BLOB_PATH, products);
    return true;
  }
  return false;
}

export async function updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    await writeBlobData(PRODUCTS_BLOB_PATH, products);
    return products[index];
  }
  return null;
}

export async function updateProductCategory(productId: string, newCategory: string): Promise<boolean> {
  const products = await getProducts();
  const product = products.find((p) => p.id === productId);
  if (product) {
    product.category = newCategory;
    await writeBlobData(PRODUCTS_BLOB_PATH, products);
    return true;
  }
  return false;
}

export async function moveProductsToCategory(fromCategory: string, toCategory: string): Promise<number> {
  const products = await getProducts();
  let count = 0;
  products.forEach((p) => {
    if (p.category === fromCategory) {
      p.category = toCategory;
      count++;
    }
  });
  if (count > 0) {
    await writeBlobData(PRODUCTS_BLOB_PATH, products);
  }
  return count;
}
