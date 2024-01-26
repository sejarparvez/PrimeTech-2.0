"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";

export default function Menu() {
  const { data: session } = useSession();

  const name = session?.user?.name || "PRIME";
  const fallback = name.slice(0, 2);
  const image = session?.user?.image;

  async function handleLogout() {
    console.log("clicked");
    signOut({ redirect: false, callbackUrl: "/" });
  }

  return (
    <div className="mr-3 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex flex-col items-end gap-1.5 p-1">
            <span className="h-[2px] w-5 bg-foreground"></span>
            <span className="h-[2px] w-4 bg-foreground"></span>
            <span className="h-[2px] w-5 bg-foreground"></span>
          </div>
        </SheetTrigger>
        <SheetContent className="pt-10">
          <SheetHeader>
            <SheetClose asChild>
              <Link href="/profile" className="flex items-center gap-4">
                <Avatar className="cursor-pointer">
                  {image && <AvatarImage src={image} />}
                  <AvatarFallback>{fallback}</AvatarFallback>
                </Avatar>
                <span className="font-extrabold">{name}</span>
              </Link>
            </SheetClose>
          </SheetHeader>
          <div className="mt-10 flex w-8/12 flex-col gap-3">
            <SheetClose asChild>
              <Link href="/profile">
                <Button variant="outline" className="flex w-full">
                  Profile
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/editprofile">
                <Button variant="secondary" className="flex w-full">
                  Edit Profile
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/newpost">
                <Button variant="default" className="flex w-full">
                  New Post
                </Button>
              </Link>
            </SheetClose>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Log Out</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
    </div>
  );
}
