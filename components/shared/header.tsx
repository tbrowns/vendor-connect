"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Sun, Moon, Menu } from "lucide-react";

import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-provider";

export function Header() {
  const pathname = usePathname();

  const { cart } = useCart();
  const { setTheme } = useTheme();

  const name = "Vendor Connect";
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  /**
   * Define the navigation items. These are rendered as a
   * list of links in the header.
   */
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "DashBoard", href: "/vendor-dashboard" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
      >
        <div className="container flex justify-around h-16 items-center">
          <Link href="/" className="flex items-center space-x-2 ">
            <Store className="h-6 w-6" />
            <span className="font-bold">{name}</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6  ">
            {/* Render the navigation items as a list of links. */}
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  /* If the current pathname matches the href of the link, make it active. */
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Render the theme switcher. This is a dropdown menu that allows the user to toggle the theme. */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Render the theme options. The selected theme is determined by the `next-themes` hook. */}
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            <UserButton />
            {/* Render the menu button. This is only visible on mobile devices. */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
