"use client";
import formatDate from "@/components/helper/hook/FormattedDate";
import { useFormattedPostLink } from "@/components/helper/hook/FormattedLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaPen, FaTrash } from "react-icons/fa";

interface props {
  title: string;
  image: string;
  name: string;
  updatedAt: string;
  category: string;
  createdAt: string;
  authorId: string;
}

export default function Header({
  title,
  image,
  name,
  updatedAt,
  category,
  createdAt,
  authorId,
}: props) {
  const { postLink } = useFormattedPostLink(createdAt, title, category),
    { data: session, status } = useSession(),
    encodeForUrl = (str: string) =>
      encodeURIComponent(str.replace(/\s+/g, "-")).toLowerCase(),
    encodedCategory = category ? encodeForUrl(category) : "";

  return (
    <>
      <div className="md:mb-10">
        <h1 className="mb-4 text-xl font-extrabold text-primary md:text-2xl lg:text-4xl">
          {title}
        </h1>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div>
            <span className="flex text-sm">
              <span className="text-sm">
                This Post Last Was Updated By
                <Link href={"/users/"}>
                  <span className="px-1 text-lg font-medium text-primary">
                    {name}
                  </span>
                </Link>
                At <span className="font-medium">{formatDate(updatedAt)}</span>
              </span>
            </span>
          </div>
          <div>
            <Link href={`/category/${encodedCategory}/page/1`}>
              <Badge>{category}</Badge>
            </Link>
          </div>
        </div>

        {status === "authenticated" &&
          (authorId === session.user?.id ||
            session.user?.role === "Administrator") && (
            <div className="mt-4 flex items-center justify-center gap-20">
              <Link href={`/editpost/${postLink}`}>
                <Button className="flex items-center gap-2">
                  <FaPen />
                  <span>Edit Post</span>
                </Button>
              </Link>
              <Button className="flex items-center gap-2" variant="destructive">
                <FaTrash />
                <span>Delete Post</span>
              </Button>
            </div>
          )}
      </div>

      <Image
        src={image}
        alt=""
        className="h-52 w-full rounded-lg object-cover md:h-[29rem]"
        width={900}
        height={900}
      />
    </>
  );
}
