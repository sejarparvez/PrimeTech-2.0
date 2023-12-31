"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { NavigationMenuComponent } from "./NavigationMenu";

export default function Navbar() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const name = session?.user?.name || "PRIME";
  const fallback = name.slice(0, 2);
  const image = session?.user?.image;

  return (
    <div className="flex w-full items-center justify-between border-b py-4 pl-4 pr-10">
      <Button variant="ghost" className="text-3xl font-extrabold">
        PrimeTech
      </Button>
      <div className="flex items-center justify-center gap-8">
        <NavigationMenuComponent />
        {email ? (
          <Link href="/dashboard" legacyBehavior passHref>
            <Avatar>
              {image && <AvatarImage src={image} />}
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Link href="/login" legacyBehavior passHref>
            <Button size="lg" className="px-10">
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
