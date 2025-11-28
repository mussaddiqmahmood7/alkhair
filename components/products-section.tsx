"use client"

import { useState, useMemo } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/lib/hooks/use-products"
import Image from "next/image"

export function ProductsSection() {
  const { data: products = [], isLoading: loading } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((p) => p.category))]
  }, [products])

  const filteredProducts = useMemo(() => {
    return selectedCategory === "All" 
      ? products 
      : products.filter((p) => p.category === selectedCategory)
  }, [products, selectedCategory])

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
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={product.imageUrl??''}
                    fill
                    alt={product.name}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
