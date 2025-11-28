export interface Product {
  id: string
  name: string
  imageUrl: string
  category: string
  createdAt: string
}

const products: Product[] = [
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

export function getProducts(): Product[] {
  return products
}

export function addProduct(product: Omit<Product, "id" | "createdAt">): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  products.unshift(newProduct)
  return newProduct
}

export function deleteProduct(id: string): boolean {
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products.splice(index, 1)
    return true
  }
  return false
}

export function updateProductCategory(productId: string, newCategory: string): boolean {
  const product = products.find((p) => p.id === productId)
  if (product) {
    product.category = newCategory
    return true
  }
  return false
}

export function moveProductsToCategory(fromCategory: string, toCategory: string): number {
  let count = 0
  products.forEach((p) => {
    if (p.category === fromCategory) {
      p.category = toCategory
      count++
    }
  })
  return count
}
