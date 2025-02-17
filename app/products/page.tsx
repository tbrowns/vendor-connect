// This file defines a React component for displaying a product page with filtering options.
// It utilizes hooks for state management and debouncing for search input.

"use client"; // Indicates that this component is a client-side component in Next.js
import { useState, useEffect } from "react"; // Importing React hooks for managing state and side effects
import { useDebounce } from "use-debounce"; // Importing a custom hook for debouncing input values

// Importing UI components for layout and styling
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Card components for displaying filters
import { Label } from "@/components/ui/label"; // Label component for form elements
import { Input } from "@/components/ui/input"; // Input component for user input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Select components for dropdown menus

import { ProductList } from "@/app/products/product-list"; // Importing a component to display the list of products
import { GetCategories } from "@/lib/categories"; // Importing a function to retrieve product categories

// Defining the main ProductsPage functional component
export default function ProductsPage() {
  // State to hold the search input value
  const [search, setSearch] = useState("");
  // State to hold the selected category
  const [category, setCategory] = useState("all");
  // State to hold the filters object for product filtering
  const [filters, setFilters] = useState({
    search: "", // Search term for filtering products
    category: "all", // Selected category for filtering products
  });
  // State to hold the debounced search term
  const [debouncedSearch] = useDebounce(search, 500); // Debouncing the search input to reduce the number of updates

  // Destructuring uniqueCategories from the GetCategories function
  const { uniqueCategories } = GetCategories();

  // useEffect hook to update filters whenever debouncedSearch or category changes
  useEffect(() => {
    setFilters({
      search: debouncedSearch, // Updating the search term in filters
      category, // Updating the category in filters
    });
  }, [debouncedSearch, category, setFilters]); // Dependencies for the effect

  // Rendering the ProductsPage component
  return (
    <div className="space-y-6 ">
      {" "}
      {/* Main container with vertical spacing */}
      <div className="flex items-center justify-between">
        {" "}
        {/* Flex container for header */}
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>{" "}
        {/* Title of the page */}
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {" "}
        {/* Flex container for filters and product list */}
        <div className="w-full md:w-64 relative">
          {" "}
          {/* Container for the filter card */}
          <Card className="fixed">
            {" "}
            {/* Card component for filters */}
            <CardHeader>
              {" "}
              {/* Header section of the card */}
              <CardTitle>Filters</CardTitle>{" "}
              {/* Title of the filters section */}
            </CardHeader>
            <CardContent className="space-y-6">
              {" "}
              {/* Content section of the card with vertical spacing */}
              <div className="space-y-2">
                {" "}
                {/* Container for search input */}
                <Label htmlFor="search">Search</Label>{" "}
                {/* Label for the search input */}
                <Input
                  id="search" // ID for the input element
                  placeholder="Search products..." // Placeholder text for the input
                  className="w-full" // Full width styling for the input
                  onChange={(e) => setSearch(e.target.value)} // Updating search state on input change
                />
              </div>
              <div className="space-y-2">
                {" "}
                {/* Container for category selection */}
                <Label>Category</Label> {/* Label for the category select */}
                <Select
                  value={category} // Current value of the select
                  onValueChange={(value) => setCategory(value)} // Updating category state on selection change
                >
                  <SelectTrigger>
                    {" "}
                    {/* Trigger for the select dropdown */}
                    <SelectValue placeholder="Select category" />{" "}
                    {/* Placeholder for the select value */}
                  </SelectTrigger>
                  <SelectContent>
                    {" "}
                    {/* Content of the select dropdown */}
                    <SelectItem value="all">All Categories</SelectItem>{" "}
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
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1">
          {" "}
          {/* Container for the product list */}
          <ProductList filters={filters} />{" "}
          {/* Rendering the product list with the current filters */}
        </div>
      </div>
    </div>
  );
}
