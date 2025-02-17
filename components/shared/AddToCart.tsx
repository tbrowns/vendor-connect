"use client";
import { Button } from "../ui/button";
import { useCart } from "./cart-provider";

interface Product {
  id: string;
  name: string;
  price: number;
  vendor_id: string;
}

export function AddCartButton(product: Product) {
  const { addToCart } = useCart();
  return (
    <Button
      className="w-full"
      onClick={() =>
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          vendor_id: product.vendor_id,
          quantity: 1,
        })
      }
    >
      Add to Cart
    </Button>
  );
}
