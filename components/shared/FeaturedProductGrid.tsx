import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AddCartButton } from "./AddToCart";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  vendor_id: string;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-square relative">
              <Image
                fill
                src={product.image_url}
                alt={product.name}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <h3 className="text-lg font-bold mt-3 truncate">{product.name}</h3>
            <p className="text-muted-foreground mt-1 truncate">
              {product.description}
            </p>
            <p className="text-lg font-bold mt-3">Ksh.{product.price}</p>

            <AddCartButton
              id={product.id}
              name={product.name}
              price={product.price}
              vendor_id={product.vendor_id}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 w-full flex justify-center">
        <Button asChild>
          <Link href="/products" className="flex items-center">
            Browse All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </>
  );
}
