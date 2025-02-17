"use client";

import { useState, useEffect } from "react";

import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

import { Trash } from "lucide-react";

import { AddProduct, UpdateProduct } from "@/app/products/product-management";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  category: string;
  image_url: string;
  vendor_id: string;
};

export default function VendorDashboard() {
  const { isSignedIn, user } = useUser();
  const userId = user?.id || "none";

  const [products, setProducts] = useState<Product[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (!isSignedIn) return;
    // Set up real-time subscription
    const channel = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "product_list",
          filter: `vendor_id=eq.${userId}`,
        },
        async (payload) => {
          console.log("Change received!", payload);

          // Fetch the latest units data
          const { data: updatedProduct } = await supabase
            .from("product_list")
            .select("*")
            .eq("vendor_id", userId);

          if (updatedProduct) {
            setProducts(updatedProduct);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isSignedIn, userId]);

  useEffect(() => {
    if (!isSignedIn) return;

    const fetchVendorDashboardData = async () => {
      const { data, error } = await supabase.rpc("get_vendor_dashboard_data", {
        input_vendor_id: userId,
      });

      console.log(data);

      if (error) {
        console.error("Error fetching dashboard data:", error);
        return;
      }

      setTotalRevenue(data[0].total_revenue);
      setProducts(data[0].products);
    };

    fetchVendorDashboardData();
  }, [isSignedIn, userId]);

  if (!isSignedIn) {
    return <div>Please log in to access this page.</div>;
  }

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error.message);
      return;
    }
  };

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
                <p className="text-3xl font-bold">{`$${totalRevenue}`}</p>
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
              <div className="flex items-center mx-4 space-x-2">
                {/* Render the "Add Product" button. */}
                <AddProduct />
              </div>

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
                        <div>{product.name}</div>
                      </TableCell>
                      <TableCell>
                        <div>{product.description}</div>
                      </TableCell>
                      <TableCell>
                        <div>{product.price}</div>
                      </TableCell>
                      <TableCell>
                        <div>{product.inventory}</div>
                      </TableCell>
                      <TableCell>
                        <UpdateProduct
                          product={product}
                          setProducts={setProducts}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                          className={`hover:bg-red-400 mx-4`}
                        >
                          <Trash></Trash>
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
                      <Button variant="outline" size="sm">
                        Process
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>002</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>2023-05-02</TableCell>
                    <TableCell>Shipped</TableCell>
                    <TableCell>$149.99</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
