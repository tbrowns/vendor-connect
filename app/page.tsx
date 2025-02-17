import { supabase } from "@/lib/supabase";
import { ProductGrid } from "@/components/shared/FeaturedProductGrid";
import Image from "next/image";

import { currentUser } from "@clerk/nextjs/server";

// Making the main component async for server-side data fetching
async function FeaturedProducts() {
  const user = await currentUser();

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  const { error: userError } = await supabase
    .from("users")
    .upsert({
      id: user.id,
      username: user.username,
      email: user.emailAddresses[0].emailAddress,
    })
    .select();

  if (userError) console.error("Error inserting UserData:", userError);

  // Fetch products directly without useState or useEffect
  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    console.error(error);
    return <div>Error loading products</div>;
  }

  // Shuffle and slice the products server-side
  const shuffledProducts = products.sort(() => Math.random() - 0.5).slice(0, 4);

  return (
    <div className="flex flex-col py-2 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-6">
        <p className="text-3xl font-bold max-w-2xl leading-tight mb-4 sm:mb-0">
          Manage your products with ease using our powerful catalog system.
          Create, update, and organize your inventory efficiently.
        </p>
        <Image
          src="/product-catalogue.png"
          alt="Product Catalogue"
          width={200}
          height={100}
          className="hidden sm:block rounded-md shadow-sm"
        />
      </div>

      <div className="text-center">
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
          Featured Products
        </h2>
        <p className="mt-2 text-muted-foreground">
          Check out our most popular products
        </p>

        {/* Pass the products to the client component */}
        <ProductGrid products={shuffledProducts} />
      </div>
    </div>
  );
}

export default FeaturedProducts;
