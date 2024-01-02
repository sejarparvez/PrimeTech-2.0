"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { TbBrandAzure } from "react-icons/tb";
import { Button } from "../ui/button";

export default function Menu() {
  const [NavOpen, setNavOpen] = useState(false);
  const { data: session } = useSession();

  const HandleClick = () => {
    setNavOpen((prev) => !prev);
  };

  const email = session?.user?.email;

  return (
    <div className="relative lg:hidden">
      <div
        className={`z-40 flex flex-col gap-1 p-3 duration-300 ${
          NavOpen ? "rotate-[360deg]" : ""
        }`}
        onClick={HandleClick}
      >
        <span
          className={`h-0.5 w-6 bg-primary duration-300 ${
            NavOpen ? " translate-y-1.5 rotate-45 " : ""
          } `}
        ></span>
        <span
          className={`h-0.5 w-6 bg-primary duration-300  ${
            NavOpen ? "hidden" : ""
          } `}
        ></span>
        <span
          className={`h-0.5 w-6 bg-primary duration-300 ${
            NavOpen ? "-rotate-45 duration-300 ease-in-out" : ""
          } `}
        ></span>
      </div>
      <div
        className={`fixed right-0 top-0 z-50 flex h-screen w-full transform justify-end  bg-slate-200 bg-opacity-5 backdrop-blur-sm transition duration-300 ease-out  ${
          NavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="z-50 flex w-9/12 flex-col gap-4 bg-white dark:bg-gray-900">
          <div className="text-primary-200 dark:text-primary-100 flex items-center justify-between px-8 py-5">
            <Link href={"/"}>
              <TbBrandAzure size={30} />
            </Link>
            <AiOutlineClose size={24} onClick={HandleClick} />
          </div>
          <hr />
          <div className="my-4 flex flex-col gap-4 px-8 [&>*]:hover:font-semibold [&>*]:hover:underline">
            <Link href={"/categories"} onClick={HandleClick}>
              Categories
            </Link>
            <Link href={"/category/hotpost"} onClick={HandleClick}>
              Trending
            </Link>
            <Link href={"/documentation"} onClick={HandleClick}>
              Documentation
            </Link>
          </div>
          <hr />
          <div className="px-8 py-6" onClick={HandleClick}>
            {email ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Link href="/signin">
                <Button>Log in</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
