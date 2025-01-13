"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ThemeSwitch from "./ThemeSwitch";
import { UserMenu } from "./UserMenu";

const navItems = [
  { title: "Home", href: "/" },
  { title: "Articles", href: "/articles" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetHeader>
              <SheetTitle>PrimeTech</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/">
          <span className="text-xl font-extrabold text-primary md:mr-16">
            PrimeTech
          </span>
        </Link>
        <nav className="hidden items-center space-x-6 text-sm font-medium lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                  : "text-muted-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div
            className={cn(
              "w-full flex-1 transition-all duration-300 ease-in-out md:w-auto md:flex-none",
              isSearchOpen
                ? "md:w-[300px] lg:w-[400px]"
                : "md:w-[200px] lg:w-[250px]",
            )}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Search submitted");
              }}
              className="relative hidden md:block"
            >
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="w-full bg-muted py-2 pl-8 pr-12 focus-visible:ring-primary"
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setIsSearchOpen(false)}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 h-7 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Search
              </Button>
            </form>
          </div>
          <ThemeSwitch />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
