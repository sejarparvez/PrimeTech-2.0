import { useFormattedPostLink } from "@/components/helper/hook/FormattedLink";
import { createSlug } from "@/components/helper/Slug";
import Image from "next/image";
import Link from "next/link";

interface props {
  image: string;
  title: string;
  id: string;
}

export default function PostModel({
  image,
  title,
  id,
}: props) {


  return (
    <div className="flex gap-2">
      <Link
        href={`${createSlug({ id: id, name: title })}`}
        className="mt-1 w-4/12"
      >
        <Image
          src={image}
          alt=""
          height={200}
          width={200}
          className="h-16 w-full rounded object-cover"
        />
      </Link>

      <div className="flex w-8/12 flex-col gap-1 text-sm">
        <div className="font-medium">
          <Link href={`${createSlug({ id: id, name: title })}`}>{title}</Link>
        </div>
      </div>
    </div>
  );
}
