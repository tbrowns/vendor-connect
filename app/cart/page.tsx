"use client";

import { supabase } from "@/lib/supabase";
import { useCart } from "@/components/shared/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@clerk/nextjs";

export default function Cart() {
  const { user } = useUser();
  const customer_id = user?.id || "none";

  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total: number = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 flex justify-between items-center">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <div className="text-xl font-semibold">
              Total: ${total.toFixed(2)}
            </div>
          </div>
          <div className="mt-6">
            <ShowCheckoutForm total={total} />
          </div>
        </>
      )}
    </div>
  );
}

import { useState } from "react";
import { handleSTKPush } from "../actions/stk-push";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function ShowCheckoutForm({ total }: { total: number }) {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  /**
   * handleSubmit is the onSubmit handler for the ProductForm component.
   * It takes a values object as an argument, which contains the values of
   * the form fields.
   *
   * It then adds the new product to the database using the Supabase
   * client.
   */
  const handleSubmit = async () => {
    try {
      console.log("Form submitted:");
      setOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Proceed to Checkout</Button>
      </DialogTrigger>
      <DialogContent>
        <CheckOutForm total={total} />
      </DialogContent>
    </Dialog>
  );
}

export function CheckOutForm({ total }: { total: number }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { user } = useUser();
  const customer_id = user?.id || "none";
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await handleSTKPush(phoneNumber, amount);

      if (response.success) {
        setResult({
          success: true,
          message: "STK Push initiated successfully",
        });
      } else {
        setResult({
          success: false,
          message: response.error || "An error occurred",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setResult({ success: false, message: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    const { error: OrderError } = await supabase.from("order").insert({
      customer_id,
      amount: total,
      status: "pending",
    });

    if (OrderError) console.log(OrderError);

    // Clear the cart after successful order
    clearCart();

    // Optionally, show a success message or redirect
    alert("Order placed successfully!");
  };

  // const placeOrder = async () => {
  //   try {

  //     // Track vendor IDs and potential errors
  //     const vendorErrors = new Set();

  //     // Process each cart item
  //     const orderItems = await Promise.all(cart.map(async (item) => {
  //       // Validate and update product inventory
  //       const { data: productData, error: productError } = await supabase
  //         .from("product_list")
  //         .select("inventory, vendor_id")
  //         .eq("id", item.id)
  //         .single();

  //       if (productError || !productData) {
  //         vendorErrors.add(item.vendor_id);
  //         return null;
  //       }

  //       // Check if enough inventory
  //       if (productData.inventory < item.quantity) {
  //         vendorErrors.add(item.vendor_id);
  //         return null;
  //       }

  //       // Update inventory
  //       const { error: updateError } = await supabase
  //         .from("product_list")
  //         .update({
  //           inventory: productData.inventory - item.quantity
  //         })
  //         .eq("id", item.id);

  //       if (updateError) {
  //         vendorErrors.add(item.vendor_id);
  //         return null;
  //       }

  //       return {
  //         vendor_id: productData.vendor_id,
  //         item_id: item.id,
  //         quantity: item.quantity,
  //         price: item.price
  //       };
  //     }));

  //     // Filter out any null items (failed processing)
  //     const validOrderItems = orderItems.filter(item => item !== null);

  //     if (validOrderItems.length === 0) {
  //       throw new Error('No valid items to order');
  //     }

  //     // Insert order
  //     const { error: orderError } = await supabase
  //       .from("orders")
  //       .insert({
  //         customer_id,
  //         amount: total,
  //         status: 'pending',
  //         // You might want to add more fields if needed
  //       })
  //       .select('id')
  //       .single();

  //     if (orderError) {
  //       throw orderError;
  //     }

  //     // If there were any vendor errors, you might want to handle them
  //     if (vendorErrors.size > 0) {
  //       console.warn('Some items could not be processed', Array.from(vendorErrors));
  //     }

  //     // Clear the cart after successful order
  //     clearCart();

  //     // Optionally, show a success message or redirect
  //     alert('Order placed successfully!');

  //   } catch (error) {
  //     console.error('Error placing order:', error);
  //     alert('Failed to place order. Please try again.');
  //   }};
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>
          Enter your mpesa number. Amount {total}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Phone</Label>
              <Input id="name" placeholder="254XXXXXXXXX" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit}>
          {loading ? "Processing..." : "Initiate STK Push"}
        </Button>
      </CardFooter>
    </Card>
  );
}
