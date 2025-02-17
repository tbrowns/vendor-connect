"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export function GetCategories() {
  // State to hold the list of unique categories
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  // State to manage the loading status of category fetching
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch categories from the Supabase database
  const fetchCategories = async () => {
    setLoading(true); // Set loading to true before starting the fetch

    // Fetching the "category" field from the "products" table in Supabase
    const { data, error } = await supabase.from("products").select("category");
    if (error) {
      console.error("Error fetching categories:", error.message); // Log the error if fetching fails
      setLoading(false); // Set loading to false if there's an error
      return; // Exit the function if there's an error
    }

    // Extract unique categories from the fetched data
    const uniqueCategories = Array.from(new Set(data.map((p) => p.category)));
    setUniqueCategories(uniqueCategories); // Update state with the unique categories
    setLoading(false); // Set loading to false after fetching is complete
  };

  // useEffect hook to fetch categories when the component mounts
  useEffect(() => {
    fetchCategories(); // Call the fetchCategories function
  }, []); // Empty dependency array means this runs once on mount

  // Return the list of unique categories and the loading status
  return { uniqueCategories, loading };
}