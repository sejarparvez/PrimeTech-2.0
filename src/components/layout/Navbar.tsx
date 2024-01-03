"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Menu from "./Menu";
import { NavigationMenuComponent } from "./NavigationMenu";

export default function Navbar() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const name = session?.user?.name || "PRIME";
  const fallback = name.slice(0, 2);
  const image = session?.user?.image;

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible =
        currentScrollPos < 200 || prevScrollPos > currentScrollPos;

      setPrevScrollPos(currentScrollPos);
      setVisible(isVisible);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <header
      className={`fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b py-3 md:w-[94.4%] md:pl-3 md:pr-10 lg:py-4 lg:pl-4 ${
        visible ? "opacity-100 backdrop-blur-md" : "opacity-0"
      }`}
    >
      <Button variant="ghost" className="text-2xl font-extrabold lg:text-3xl">
        <Link href="/">PrimeTech</Link>
      </Button>
      <div className="hidden items-center justify-center md:gap-4 lg:flex lg:gap-8">
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
            <Button size="lg" className="md:px-6 lg:px-10">
              Login
            </Button>
          </Link>
        )}
      </div>
      <div className="block lg:hidden">
        <Menu />
      </div>
    </header>
  );
}
