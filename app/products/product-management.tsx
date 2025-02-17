"use client";
import { useState } from "react";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { supabase } from "@/lib/supabase";
import { GetCategories } from "@/lib/categories"; // Importing a function to retrieve product categories

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  category: string;
  image_url: string;
  vendor_id: string;
}

/**
 * AddProduct is a component that allows users to add a new product to the
 * database. It renders a button that when clicked, opens a dialog that
 * contains a form for adding a new product.
 *
 * The form is rendered by the ProductForm component, which is passed an
 * onSubmit handler that adds the new product to the database.
 *
 * The default values for the form are set to some placeholder values, but
 * these can be overridden by passing a defaultValues prop to the
 * AddProduct component.
 */
export function AddProduct({
  defaultValues = {
    name: "",
    description: "",
    price: 0,
    inventory: 1,
    category: "",
    image_url:
      "https://images.unsplash.com/photo-1606786013940-3f5e1c3c7d1a?auto=format&fit=crop&w=800",
  },
}: {
  defaultValues?: {
    name: string;
    description: string;
    price: number;
    inventory: number;
    category: string;
    image_url: string;
  };
}) {
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
  const handleSubmit = async (values: {
    name: string;
    description: string;
    price: number;
    inventory: number;
    category: string;
    image_url: string;
  }) => {
    if (
      !values.name ||
      !values.description ||
      !values.price ||
      !values.category ||
      !values.inventory ||
      !user
    ) {
      console.error("Error adding product: missing required fields");
      return;
    }

    try {
      const { data, error } = await supabase.from("products").insert([
        {
          name: values.name,
          description: values.description,
          price: values.price,
          category: values.category,
          image_url: values.image_url,
          inventory: values.inventory,
          vendor_id: user?.id || "",
        },
      ]);
      if (error) {
        console.error("Error adding product:", error.message);
        return;
      }

      console.log("Form submitted:", data);
      setOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new product.
          </DialogDescription>
        </DialogHeader>
        <ProductForm onSubmit={handleSubmit} defaultValues={defaultValues} />
      </DialogContent>
    </Dialog>
  );
}

/**
 * UpdateProduct is a component that allows users to update an existing
 * product in the database. It renders a button that when clicked, opens a
 * dialog that contains a form for updating the product.
 *
 * The form is rendered by the ProductForm component, which is passed an
 * onSubmit handler that updates the product in the database.
 *
 * The default values for the form are set to the current values of the
 * product being updated.
 */
export function UpdateProduct({
  product,
  setProducts,
}: {
  /**
   * The product to be updated.
   */
  product: Product;
  /**
   * A function that updates the list of products in the parent component.
   */
  setProducts: (products: Product[]) => void;
}) {
  const [open, setOpen] = useState(false);

  /**
   * handleSubmit is the onSubmit handler for the ProductForm component.
   * It takes a values object as an argument, which contains the values of
   * the form fields.
   *
   * It then updates the product in the database using the Supabase client.
   */
  const handleSubmit = async (values: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    inventory: number;
  }) => {
    /**
     * Update the list of products in the parent component by mapping over
     * the list and updating the product that matches the id of the product
     * being updated.
     */

    // Fetch the current list of products
    const { data: prevProducts, error: ProductError } = await supabase
      .from("products")
      .select("*");

    if (ProductError) {
      console.error("Error fetching products:", ProductError.message);
      return;
    }
    const updatedProducts = prevProducts.map((p: Product) => {
      if (p.id === product.id) {
        return {
          ...p,
          ...values,
        };
      }
      return p;
    });
    setProducts(updatedProducts);

    /**
     * Update the product in the database using the Supabase client.
     */
    const { data, error } = await supabase
      .from("products")
      .update([
        {
          name: values.name,
          description: values.description,
          price: values.price,
          category: values.category,
          image_url: values.image_url,
          inventory: values.inventory,
        },
      ])
      .eq("id", product.id);
    if (error) {
      console.error("Error updating product:", error.message);
      return;
    }

    console.log("Form submitted:", data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to update a product.
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          onSubmit={() => {
            handleSubmit({ ...product });
          }}
          defaultValues={{
            ...product,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number(),
  inventory: z.number(),
  category: z.string().min(1, "Please select a category"),
  image_url: z.string().url("Must be a valid URL"),
});

export function ProductForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  defaultValues?: z.infer<typeof formSchema>;
}) {
  // Set a local state variable to track whether the form is loading
  const [isLoading, setIsLoading] = useState(false);

  // Destructure the uniqueCategories array from the GetCategories function
  const { uniqueCategories } = GetCategories();

  // Initialize the form with the default values and the form schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Define a function to handle the form submission
  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Set the isLoading state to true to indicate that the form is loading
      setIsLoading(true);

      // Call the onSubmit function passed in as a prop
      await onSubmit(values);

      // Reset the form after submission
      form.reset();

      // Show a toast message to indicate that the form was submitted successfully
      toast({
        title: "Success",
        description: "Product has been created successfully.",
      });
    } catch (error) {
      // Log any errors that occur during submission
      console.error(error);

      // Show a toast message to indicate that there was an error
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Set the isLoading state to false after submission is complete
      setIsLoading(false);
    }
  }

  // Return the form
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 w-full"
      >
        {/* Name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                {/* Render the input field for the name */}
                <Input placeholder="Product name" {...field} />
              </FormControl>
              {/* Render the error message for the name field */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                {/* Render the textarea field for the description */}
                <Textarea placeholder="Product description" {...field} />
              </FormControl>
              {/* Render the error message for the description field */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price and category fields */}
        <div className="grid grid-cols-3 gap-4 ">
          {/* Price field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  {/* Render the input field for the price */}
                  <Input placeholder="99.99" {...field} />
                </FormControl>
                {/* Render the error message for the price field */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price field */}
          <FormField
            control={form.control}
            name="inventory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory</FormLabel>
                <FormControl>
                  {/* Render the input field for the price */}
                  <Input placeholder="1" {...field} />
                </FormControl>
                {/* Render the error message for the price field */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                {/* Render the select field for the category */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    {/* Render the select trigger */}
                    <SelectTrigger>
                      {/* Render the select value */}
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  {/* Render the select content */}
                  <SelectContent>
                    {/* Option for all categories */}
                    {uniqueCategories.map(
                      (
                        category // Mapping through unique categories to create select items
                      ) => (
                        <SelectItem key={category} value={category}>
                          {" "}
                          {/* Unique key for each category */}
                          {category} {/* Displaying the category name */}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                {/* Render the error message for the category field */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image URL field */}
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                {/* Render the input field for the image URL */}
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              {/* Render the error message for the image URL field */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}
