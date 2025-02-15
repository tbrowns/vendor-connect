"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

type Product = {
  id: number
  name: string
  description: string
  price: number
  inventory: number
}

export default function VendorDashboard() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Wireless Earbuds", description: "High-quality wireless earbuds", price: 79.99, inventory: 100 },
    { id: 2, name: "Smart Watch", description: "Feature-rich smart watch", price: 199.99, inventory: 50 },
    { id: 3, name: "Laptop Stand", description: "Ergonomic laptop stand", price: 39.99, inventory: 200 },
  ])
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    inventory: 0
  })

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const product = {
      id: products.length + 1,
      ...newProduct
    }
    setProducts([...products, product])
    setNewProduct({ name: '', description: '', price: 0, inventory: 0 })
  }

  const updateProduct = (id: number, field: keyof Product, value: string | number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$12,345.67</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Orders to Fulfill</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">23</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">7</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Manage Products</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addProduct} className="grid gap-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input 
                      id="name" 
                      value={newProduct.name} 
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      value={newProduct.price} 
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={newProduct.description} 
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="inventory">Initial Inventory</Label>
                  <Input 
                    id="inventory" 
                    type="number" 
                    value={newProduct.inventory} 
                    onChange={(e) => setNewProduct({...newProduct, inventory: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <Button type="submit">Add Product</Button>
              </form>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Input 
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea 
                          value={product.description}
                          onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          value={product.price}
                          onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={product.inventory}
                          onChange={(e) => updateProduct(product.id, 'inventory', parseInt(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>001</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>2023-05-01</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>$99.99</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Process</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>002</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>2023-05-02</TableCell>
                    <TableCell>Shipped</TableCell>
                    <TableCell>$149.99</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

