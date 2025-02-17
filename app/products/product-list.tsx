"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase";

import { SkeletonProductCard } from "@/components/shared/loading_cards";
import { useCart } from "@/components/shared/cart-provider";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  vendor_id: string;
}

export function ProductList({
  filters,
}: {
  filters: { search: string; category: string };
}) {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const filterProducts = (
    products: Product[],
    filters: { search: string; category: string }
  ) => {
    return products.filter((product) => {
      const product_name = filters.search.toLowerCase().trim();
      const searchMatch = product.name.toLowerCase().includes(product_name);
      const category = product.category.toLowerCase();
      const filters_category = filters.category.toLowerCase();
      const categoryMatch =
        filters.category === "all" || category === filters_category;
      return searchMatch && categoryMatch;
    });
  };

  useEffect(() => {
    console.log("Filters changed:", filters);
    const filteredProducts = filterProducts(allProducts, filters);
    console.log("Filtered products:", allProducts);
    console.log("Filtered products:", filteredProducts);
    setProducts(filteredProducts);
  }, [allProducts, filters]);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setAllProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {loading && <SkeletonProductCard length={3} />}
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="aspect-square relative">
              <Image
                layout="fill"
                src={product.image_url}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-bold ">${product.price}</p>
              <p className="bg-accent p-1 px-2 rounded-md">
                {product.category}
              </p>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button
              className="w-full"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  vendor_id: product.vendor_id,
                })
              }
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
