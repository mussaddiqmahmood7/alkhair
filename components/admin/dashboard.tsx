"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Loader2,
  Zap,
  LogOut,
  Upload,
  Trash2,
  Plus,
  ImageIcon,
  Package,
  Settings,
  Save,
  Users,
  FolderOpen,
  Edit2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/lib/products"
import type { SiteSettings } from "@/lib/site-settings"
import type { Client, BalanceStatus } from "@/lib/clients"
import type { Category } from "@/lib/categories"

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [heroFile, setHeroFile] = useState<File | null>(null)
  const [heroPreview, setHeroPreview] = useState("")
  const [ownerFile, setOwnerFile] = useState<File | null>(null)
  const [ownerPreview, setOwnerPreview] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [addingCategory, setAddingCategory] = useState(false)

  // Client form states
  const [clientForm, setClientForm] = useState({
    clientId: "",
    password: "",
    name: "",
    shopName: "",
    phone: "",
    address: "",
    description: "",
    status: "proceed" as BalanceStatus,
  })
  const [addingClient, setAddingClient] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const heroFileRef = useRef<HTMLInputElement>(null)
  const ownerFileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchProducts()
    fetchSettings()
    fetchClients()
    fetchCategories()
  }, [])

  const checkAuth = async () => {
    const res = await fetch("/api/auth/check")
    const data = await res.json()
    if (!data.authenticated) {
      router.push("/admin")
    }
  }

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

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings")
      const data = await res.json()
      setSettings(data.settings)
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    }
  }

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients")
      const data = await res.json()
      setClients(data.clients)
    } catch (error) {
      console.error("Failed to fetch clients:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data.categories)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin")
    router.refresh()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHeroFile(file)
      setHeroPreview(URL.createObjectURL(file))
    }
  }

  const handleOwnerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setOwnerFile(file)
      setOwnerPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !name) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) throw new Error("Upload failed")

      const { url } = await uploadRes.json()

      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          imageUrl: url,
          category: category === "custom" ? customCategory : category,
        }),
      })

      if (productRes.ok) {
        setName("")
        setCategory("")
        setCustomCategory("")
        setSelectedFile(null)
        setPreviewUrl("")
        if (fileInputRef.current) fileInputRef.current.value = ""
        fetchProducts()
      }
    } catch (error) {
      console.error("Failed to add product:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (product: Product) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setDeleting(product.id)

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: product.imageUrl }),
      })

      if (res.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
    } finally {
      setDeleting(null)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings) return
    setSavingSettings(true)

    try {
      let heroImageUrl = settings.heroImage
      let ownerImageUrl = settings.ownerImage

      if (heroFile) {
        const formData = new FormData()
        formData.append("file", heroFile)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          heroImageUrl = url
        }
      }

      if (ownerFile) {
        const formData = new FormData()
        formData.append("file", ownerFile)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          ownerImageUrl = url
        }
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, heroImage: heroImageUrl, ownerImage: ownerImageUrl }),
      })

      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
        setHeroFile(null)
        setHeroPreview("")
        setOwnerFile(null)
        setOwnerPreview("")
        alert("Settings saved successfully!")
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("Failed to save settings")
    } finally {
      setSavingSettings(false)
    }
  }

  // Client management functions
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingClient(true)

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientForm),
      })

      if (res.ok) {
        setClientForm({
          clientId: "",
          password: "",
          name: "",
          shopName: "",
          phone: "",
          address: "",
          description: "",
          status: "proceed",
        })
        fetchClients()
      }
    } catch (error) {
      console.error("Failed to add client:", error)
    } finally {
      setAddingClient(false)
    }
  }

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClient) return
    setAddingClient(true)

    try {
      const res = await fetch(`/api/clients/${editingClient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientForm),
      })

      if (res.ok) {
        setEditingClient(null)
        setClientForm({
          clientId: "",
          password: "",
          name: "",
          shopName: "",
          phone: "",
          address: "",
          description: "",
          status: "proceed",
        })
        fetchClients()
      }
    } catch (error) {
      console.error("Failed to update client:", error)
    } finally {
      setAddingClient(false)
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchClients()
      }
    } catch (error) {
      console.error("Failed to delete client:", error)
    }
  }

  const startEditClient = (client: Client) => {
    setEditingClient(client)
    setClientForm({
      clientId: client.clientId,
      password: client.password,
      name: client.name,
      shopName: client.shopName,
      phone: client.phone,
      address: client.address,
      description: client.description,
      status: client.status,
    })
  }

  // Category management functions
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    setAddingCategory(true)

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      })

      if (res.ok) {
        setNewCategoryName("")
        fetchCategories()
      }
    } catch (error) {
      console.error("Failed to add category:", error)
    } finally {
      setAddingCategory(false)
    }
  }

  const handleDeleteCategory = async (cat: Category) => {
    if (cat.isDefault) {
      alert("Cannot delete the default category")
      return
    }
    if (!confirm(`Delete "${cat.name}"? Products in this category will be moved to "General".`)) return

    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, categoryName: cat.name }),
      })

      if (res.ok) {
        fetchCategories()
        fetchProducts()
      }
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  const getStatusColor = (status: BalanceStatus) => {
    switch (status) {
      case "proceed":
        return "bg-green-500"
      case "no-balance":
        return "bg-red-500"
      case "pending":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  const allCategories = categories.map((c) => c.name)

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-card-foreground">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Al-Khair Traders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  View Website
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" /> Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <FolderOpen className="w-4 h-4" /> Categories
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-2">
              <Users className="w-4 h-4" /> Clients
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add New Product
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., China Board 8+2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Product Image</Label>
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {previewUrl ? (
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-40 object-contain rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="w-10 h-10 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload image</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={uploading || !selectedFile || !name || !category}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Add Product
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    All Products ({products.length})
                  </h2>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No products yet.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="bg-card rounded-xl border border-border overflow-hidden group">
                        <div className="aspect-video bg-muted overflow-hidden">
                          <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                          <h3 className="font-semibold text-card-foreground mt-2 line-clamp-1">{product.name}</h3>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-muted-foreground">
                              {new Date(product.createdAt).toLocaleDateString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(product)}
                              disabled={deleting === product.id}
                            >
                              {deleting === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add New Category
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        placeholder="e.g., MCB Board"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={handleAddCategory}
                      className="w-full"
                      disabled={addingCategory || !newCategoryName.trim()}
                    >
                      {addingCategory ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Add Category
                    </Button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  All Categories ({categories.length})
                </h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-card rounded-xl border border-border p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-card-foreground">{cat.name}</p>
                        {cat.isDefault && (
                          <span className="text-xs text-muted-foreground">(Default - cannot delete)</span>
                        )}
                      </div>
                      {!cat.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteCategory(cat)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    {editingClient ? (
                      <Edit2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Plus className="w-5 h-5 text-primary" />
                    )}
                    {editingClient ? "Edit Client" : "Add New Client"}
                  </h2>

                  <form onSubmit={editingClient ? handleUpdateClient : handleAddClient} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientId">Client ID</Label>
                        <Input
                          id="clientId"
                          placeholder="ALK001"
                          value={clientForm.clientId}
                          onChange={(e) => setClientForm({ ...clientForm, clientId: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clientPassword">Password</Label>
                        <Input
                          id="clientPassword"
                          type="text"
                          placeholder="password123"
                          value={clientForm.password}
                          onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        placeholder="Muhammad Ahmed"
                        value={clientForm.name}
                        onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shopName">Shop Name</Label>
                      <Input
                        id="shopName"
                        placeholder="Ahmed Electricals"
                        value={clientForm.shopName}
                        onChange={(e) => setClientForm({ ...clientForm, shopName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Phone Number</Label>
                      <Input
                        id="clientPhone"
                        placeholder="03001234567"
                        value={clientForm.phone}
                        onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientAddress">Address</Label>
                      <Input
                        id="clientAddress"
                        placeholder="Main Bazaar, Lahore"
                        value={clientForm.address}
                        onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientDescription">Description</Label>
                      <Textarea
                        id="clientDescription"
                        placeholder="Regular wholesale customer..."
                        value={clientForm.description}
                        onChange={(e) => setClientForm({ ...clientForm, description: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Balance Status</Label>
                      <Select
                        value={clientForm.status}
                        onValueChange={(v: BalanceStatus) => setClientForm({ ...clientForm, status: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="proceed">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                              Proceed (Ready to Order)
                            </span>
                          </SelectItem>
                          <SelectItem value="no-balance">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              No Balance (Cannot Order)
                            </span>
                          </SelectItem>
                          <SelectItem value="pending">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              Pending (3-4 Days)
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={addingClient}>
                        {addingClient ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : editingClient ? (
                          <Save className="w-4 h-4 mr-2" />
                        ) : (
                          <Plus className="w-4 h-4 mr-2" />
                        )}
                        {editingClient ? "Update Client" : "Add Client"}
                      </Button>
                      {editingClient && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingClient(null)
                            setClientForm({
                              clientId: "",
                              password: "",
                              name: "",
                              shopName: "",
                              phone: "",
                              address: "",
                              description: "",
                              status: "proceed",
                            })
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  All Clients ({clients.length})
                </h2>

                {clients.length === 0 ? (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No clients yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-3 h-3 rounded-full mt-1.5 ${getStatusColor(client.status)}`}
                            title={client.status}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-card-foreground">{client.name}</p>
                              <span className="text-xs bg-muted px-2 py-0.5 rounded">{client.clientId}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{client.shopName}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {client.phone} | {client.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-7 sm:ml-0">
                          <Button variant="outline" size="sm" onClick={() => startEditClient(client)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            {settings && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Site Settings
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-card-foreground border-b border-border pb-2">
                      Business Information
                    </h3>

                    <div className="space-y-2">
                      <Label>Business Name</Label>
                      <Input
                        value={settings.businessName}
                        onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Address Line 1</Label>
                      <Input
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Address Line 2</Label>
                      <Input
                        value={settings.addressLine2}
                        onChange={(e) => setSettings({ ...settings, addressLine2: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Trusted Since (Year)</Label>
                      <Input
                        value={settings.trustedSince}
                        onChange={(e) => setSettings({ ...settings, trustedSince: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-card-foreground border-b border-border pb-2">Statistics</h3>

                    <div className="space-y-2">
                      <Label>Years Experience</Label>
                      <Input
                        value={settings.yearsExperience}
                        onChange={(e) => setSettings({ ...settings, yearsExperience: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Happy Customers</Label>
                      <Input
                        value={settings.happyCustomers}
                        onChange={(e) => setSettings({ ...settings, happyCustomers: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Total Products</Label>
                      <Input
                        value={settings.totalProducts}
                        onChange={(e) => setSettings({ ...settings, totalProducts: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cities Served</Label>
                      <Input
                        value={settings.citiesServed}
                        onChange={(e) => setSettings({ ...settings, citiesServed: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <h3 className="font-medium text-card-foreground border-b border-border pb-2">Owner Information</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Owner Name</Label>
                        <Input
                          value={settings.ownerName}
                          onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Owner Title</Label>
                        <Input
                          value={settings.ownerTitle}
                          onChange={(e) => setSettings({ ...settings, ownerTitle: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Owner Bio</Label>
                      <Textarea
                        value={settings.ownerBio}
                        onChange={(e) => setSettings({ ...settings, ownerBio: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Owner Image</Label>
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => ownerFileRef.current?.click()}
                      >
                        {ownerPreview || settings.ownerImage ? (
                          <img
                            src={ownerPreview || settings.ownerImage}
                            alt="Owner"
                            className="w-32 h-32 object-cover rounded-full mx-auto"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="w-10 h-10 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload owner image</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={ownerFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleOwnerFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <h3 className="font-medium text-card-foreground border-b border-border pb-2">Hero Section</h3>

                    <div className="space-y-2">
                      <Label>Hero Image</Label>
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => heroFileRef.current?.click()}
                      >
                        {heroPreview || settings.heroImage ? (
                          <img
                            src={heroPreview || settings.heroImage}
                            alt="Hero"
                            className="w-full max-w-md h-48 object-contain mx-auto rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="w-10 h-10 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload hero image</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={heroFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleHeroFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Client Portal Status Messages */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="font-medium text-card-foreground border-b border-border pb-2">
                      Client Portal Messages
                    </h3>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                        <p className="font-medium text-green-600 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-green-500" />
                          Ready to Order
                        </p>
                        <div className="space-y-2">
                          <Label className="text-sm">Title</Label>
                          <Input
                            value={settings.statusMessages.proceedTitle}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                statusMessages: { ...settings.statusMessages, proceedTitle: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Message</Label>
                          <Textarea
                            value={settings.statusMessages.proceedMessage}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                statusMessages: { ...settings.statusMessages, proceedMessage: e.target.value },
                              })
                            }
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="space-y-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="font-medium text-red-600 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500" />
                          No Balance
                        </p>
                        <div className="space-y-2">
                          <Label className="text-sm">Title</Label>
                          <Input
                            value={settings.statusMessages.noBalanceTitle}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                statusMessages: { ...settings.statusMessages, noBalanceTitle: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Message</Label>
                          <Textarea
                            value={settings.statusMessages.noBalanceMessage}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                statusMessages: { ...settings.statusMessages, noBalanceMessage: e.target.value },
                              })
                            }
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="space-y-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <p className="font-medium text-amber-600 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-amber-500" />
                          Pending (3-4 Days)
                        </p>
                        <div className="space-y-2">
                          <Label className="text-sm">Title</Label>
                          <Input
                            value={settings.statusMessages.pendingTitle}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                statusMessages: { ...settings.statusMessages, pendingTitle: e.target.value },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Message</Label>
                          <Textarea
                            value={settings.statusMessages.pendingMessage}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                statusMessages: { ...settings.statusMessages, pendingMessage: e.target.value },
                              })
                            }
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <Button onClick={handleSaveSettings} disabled={savingSettings} className="w-full md:w-auto">
                    {savingSettings ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save All Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
