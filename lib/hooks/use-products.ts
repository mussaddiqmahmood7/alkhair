import { useQuery } from "@tanstack/react-query"
import type { Product } from "@/lib/products"

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products")
  if (!res.ok) {
    throw new Error("Failed to fetch products")
  }
  const data = await res.json()
  return data.products
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 30 * 1000, // 30 seconds
  })
}

