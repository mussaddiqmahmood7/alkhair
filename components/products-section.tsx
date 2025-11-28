"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ["All", ...new Set(products.map((p) => p.category))]
  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory)

  return (
    <section id="products" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our <span className="text-primary">Products</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Browse our extensive collection of high-quality electrical distribution boards, MCB boxes, and China fitting
            panels.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-card-foreground mt-2 line-clamp-2">{product.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
