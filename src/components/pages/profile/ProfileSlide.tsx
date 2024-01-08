"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfileSlide() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const name = session?.user?.name || "PRIME";
  const fallback = name.slice(0, 2);
  const image = session?.user?.image;

  async function handleLogout() {
    console.log("clicked");
    signOut({ redirect: true, callbackUrl: "/" });
  }
  return (
    <>
      {email ? (
        <Sheet>
          <SheetTrigger asChild>
            <Avatar className="cursor-pointer">
              {image && <AvatarImage src={image} />}
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
          </SheetTrigger>
          <SheetContent className="pt-10">
            <Link href="/profile" className="flex items-center gap-4">
              <Avatar className="cursor-pointer">
                {image && <AvatarImage src={image} />}
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
              <span className="font-extrabold text-primary">{name}</span>
            </Link>
            <div className="mt-10">
              <Button
                size="lg"
                onClick={handleLogout}
                variant="destructive"
                className="mx-auto flex"
              >
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Link href="/login">
          <Button size="lg" className="md:px-6 lg:px-10">
            Login
          </Button>
        </Link>
      )}
    </>
  );
}
