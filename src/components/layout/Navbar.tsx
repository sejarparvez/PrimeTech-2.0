"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileSlide from "../pages/profile/ProfileSlide";
import { Button } from "../ui/button";
import Menu from "./Menu";
import { NavigationMenuComponent } from "./NavigationMenu";

export default function Navbar() {
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
      className={`fixed top-0 z-50 flex h-16 w-full items-center justify-between py-3 transition-all duration-300 md:w-[94.4%] md:pl-3 md:pr-10 lg:py-4 lg:pl-4 ${
        visible
          ? "translate-y-0 opacity-100 backdrop-blur-md"
          : "-translate-y-20 opacity-10"
      }`}
    >
      <Button
        variant="ghost"
        className="bg-background text-2xl font-extrabold lg:text-3xl"
      >
        <Link href="/">PrimeTech</Link>
      </Button>
      <div className="hidden items-center justify-center md:gap-4 lg:flex lg:gap-8">
        <NavigationMenuComponent />
        <ProfileSlide />
      </div>
      <div className="block lg:hidden">
        <Menu />
      </div>
    </header>
  );
}
