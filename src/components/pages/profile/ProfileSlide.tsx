"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
    signOut({ redirect: false, callbackUrl: "/" });
  }

  console.log(session)
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="lg">
                    Log Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Log Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
